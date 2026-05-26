# views.py
from rest_framework import generics, status, filters, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import *
from .permissions import *
from rest_framework.pagination import CursorPagination
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

class CategoryListView(generics.ListAPIView):
    #GET /api/categories/
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]  # Доступно всем

class AnimalListView(generics.ListAPIView):
    # GET /api/animals/
    queryset = Animal.objects.all()
    serializer_class = AnimalSerializer
    permission_classes = [AllowAny]

# РАБОТА С ТОВАРАМИ
class ProductResultsSetPagination(CursorPagination):
    page_size = 9 # кол-во элементов на странице по умолчанию
    page_size_query_param = 'page_size' # Клиент может переопределить размер

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    #Добавляем фильтрацию и поиск
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,
                       filters.OrderingFilter]
    # По каким полям фильтровать
    filterset_fields = ['animal', 'category', 'animal_size', 'in_stock']
    search_fields = ['title', 'description']  # Поиск по названию и описанию
    ordering_fields = ['price', 'created_at', 'average_rating']  # Сортировка

    def get_permissions(self):
        # Динамическое определение прав в зависимости от действия
        if self.action == 'create':
            # Для создания нужна авторизация
            permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['update', 'partial_update', 'destroy']:
            # Для изменения нужен автор или админ
            permission_classes = [IsAuthorOrReadOnly]
        else:
            # Для чтения (list, retrieve) доступно всем
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(user = self.request.user)

    @action(detail=False, methods=['post'], url_path='filters', permission_classes=[AllowAny])
    def get_filters(self, request):
        # Получаем базовый QuerySet
        queryset = self.get_queryset()
        categories = request.data.get('categories', [])
        animals = request.data.get('animals', [])
        if categories:
            queryset = queryset.filter(category__title__in=categories)
        if animals:
            queryset = queryset.filter(animal__title__in=animals)
        serializer=self.get_serializer(queryset, many=True)
        return Response(serializer.data)

# КОРЗИНА (ТОЛЬКО ДЛЯ АВТОРИЗОВАННЫХ)
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Получаем товары только из корзины текущего пользователя
        return CartItem.objects.filter(cart__user=self.request.user)

    def perform_create(self, serializer):
        # Автоматически находим или создаем корзину пользователя при добавлении товара
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        # Логика: если товар уже есть в корзине — увеличиваем количество
        product = serializer.validated_data['product']
        item = CartItem.objects.filter(cart=cart, product=product).first()
        if item:
            item.quantity += serializer.validated_data.get('quantity', 1)
            item.save()
        else:
            serializer.save(cart=cart)

class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Возвращаем корзину текущего пользователя вне зависимости от PK в URL
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart

# ИЗБРАННОЕ
class WishlistItemViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Получаем товары только из корзины текущего пользователя
        return WishlistItem.objects.filter(wishlist__user=self.request.user)

    def perform_create(self, serializer):
        # Автоматически находим или создаем корзину пользователя при добавлении товара
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        product = serializer.validated_data['product']
        item = WishlistItem.objects.filter(wishlist=wishlist, product=product).first()
        if not item:
            serializer.save(wishlist=wishlist)

class WishlistDetailView(generics.RetrieveAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        wishlist, created = Wishlist.objects.get_or_create(user=self.request.user)
        return wishlist

# ========== 5. ПОЛЬЗОВАТЕЛИ ==========
class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

# Выход
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Выход выполнен успешно"})

class RegisterView(generics.CreateAPIView):
    # POST /api/register/
    # Регистрация нового пользователя
    serializer_class = UserRegistrationSerializer()
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        #Сразу выдаем всем токены после регистрации
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        },
        status=status.HTTP_201_CREATED)

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
         # Возвращает профиль текущего пользователя
         return self.request.user

    def update(self, request, *args, **kwargs):
        # Частичное обновление (PATCH) по умолчанию работает
        # Полное обновление (PUT) требует все поля
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            'user': serializer.data,
            'message': 'Профиль успешно обновлен'
        })

# ОТЗЫВЫ
class ReviewListView(generics.ListCreateAPIView):
    # GET /api/products/<product_id>/reviews/ - список отзывов
    # POST /api/products/<product_id>/reviews/ - добавить отзыв
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        product = get_object_or_404(Product, id=product_id)
        serializer.save(user=self.request.user, product=product)