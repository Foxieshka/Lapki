# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Q
from catalogue.models import *
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'user_avatar', 'product',
                  'content', 'created_at', 'updated_at', 'rating']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_user_avatar(self, obj):
        if obj.user.avatar:
            return obj.user.avatar.url
        return None

    def validate_content(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Отзыв должен содержать минимум 10 символов")
        return value

class CategorySerializer(serializers.ModelSerializer):
   class Meta:
        model = Category
        fields = ['id', 'title']
        read_only_fields = ['id']

class AnimalSerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    class Meta:
        model = Animal
        fields = ['id', 'image', 'description', 'title', 'products_count']
        read_only_fields = ['id', 'products_count']

    def get_products_count(self, obj):
        return Product.objects.filter(animal=obj).count()

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']
        read_only_fields = ['id', ]

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    animal_title = serializers.CharField(source='animal__title', read_only=True)
    category_title = CategorySerializer(source='category__title', read_only=True)
    user_name = serializers.CharField(source='user__username', read_only=True)

    # Кастомные поля
    final_price = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'user', 'user_name', 'title', 'description',
            'price', 'discount', 'final_price',
            'in_stock', 'average_rating', 'box_type',
            'thumbnail', 'animal', 'animal_title',
            'category', 'category_title', 'reviews',
            'animal_size', 'created_at', 'updated_at',
            'images',
        ]
        read_only_fields = ['created_at', 'updated_at', 'average_rating']  # Только для чтения

    def get_final_price(self, obj):
        return obj.get_final_price()

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Цена должна быть больше 0")
        return value

    def validate_discount(self, value):
        if value > 100:
            raise serializers.ValidationError("Скидка не может превышать 100%")
        return value

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            return sum(r.rating for r in reviews) / len(reviews)
        return 0

class CartItemSerializer(serializers.ModelSerializer):
    # Сериализатор для товара в корзине
    product_detail = ProductSerializer(source='product', read_only=True)
    total_price = serializers.DecimalField(max_digits=9, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_detail', 'quantity', 'total_price']

    def get_total_price(self, obj):
        return obj.get_total_price()


class CartSerializer(serializers.ModelSerializer):
    # Сериализатор для корзины
    items = CartItemSerializer(many=True, read_only=True)
    total_quantity = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_quantity', 'total_price']

    def get_total_quantity(self, obj):
        # Общее количество товаров в корзине
        return sum(item.quantity for item in obj.items.all())

    def get_total_price(self, obj):
        # Общая стоимость корзины
        return sum(item.get_total_price() for item in obj.items.all())


class WishlistItemSerializer(serializers.ModelSerializer):
    # Сериализатор для товара в избранном
    product_detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_detail']


class WishlistSerializer(serializers.ModelSerializer):
    # Сериализатор для избранного
    items = WishlistItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'items', 'total_items']

    def get_total_items(self, obj):
        return obj.items.count()

# Пользователь
class UserSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only=True)
    wishlist = WishlistSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'avatar', 'birth_date', 'wishlist', 'cart']
        read_only_fields = ['id', 'created_at']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        # Проверяем, что пароли совпадают
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        # Создаем пользователя
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get('username')
        # Пытаемся найти пользователя по username или email
        try:
            # Ищем пользователя (username или email)
            user = User.objects.get(
                Q(username=username_or_email) | Q(email=username_or_email)
            )
            # Подменяем username для аутентификации
            attrs['username'] = user.username
        except User.DoesNotExist:
            # Если пользователь не найден, оставляем как есть
            pass

        # Вызываем родительский метод
        data = super().validate(attrs)
        # Добавляем данные пользователя
        avatar_url = None
        if hasattr(self.user, 'avatar') and self.user.avatar:
            avatar_url = self.user.avatar.url
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'avatar': avatar_url,
        }
        return data
