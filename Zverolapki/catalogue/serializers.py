from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
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
        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_user_avatar(self, obj):
        if obj.user.avatar:
            return obj.user.avatar.url
        return None

    def validate_content(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Отзыв должен содержать минимум 10 символов")
        return value

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'title', 'category']
        # или fields = '__all__'
        # или exclude = ['category'] - исключить поле

class CategorySerializer(serializers.ModelSerializer):
    # Вложенный сериализатор - показывает все подкатегории внутри категории
    sub_categories = SubCategorySerializer(many=True, read_only=True)
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'title', 'sub_categories', 'products_count']
        read_only_fields = ['id', 'products_count']

    def get_products_count(self, obj):
        return Product.objects.filter(sub_category__category=obj).count()

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = ['id', 'image', 'description', 'title']
        read_only_fields = ['id',]

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']
        read_only_fields = ['id', ]

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    animal_title = serializers.CharField(source='animal__title', read_only=True)
    sub_category_detail = SubCategorySerializer(source='sub_category', read_only=True)
    user_name = serializers.CharField(source='user__username', read_only=True)

    # Кастомные поля
    final_price = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'user', 'user_name', 'title', 'description', 'price', 'discount', 'final_price',
            'in_stock', 'average_rating', 'box_type',
            'thumbnail', 'animal', 'animal_title',
            'sub_category', 'sub_category_detail', 'reviews',
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

class ProductListSerializer(serializers.ModelSerializer):
    #Упрощенный сериализатор для списка товаров (экономия трафика)
    final_price = serializers.SerializerMethodField()
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'discount', 'final_price',
                  'in_stock', 'thumbnail', 'rating']

    def get_final_price(self, obj):
        return obj.get_final_price()

class CartItemSerializer(serializers.ModelSerializer):
    # Сериализатор для товара в корзине
    product_detail = ProductListSerializer(source='product', read_only=True)
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
    product_detail = ProductListSerializer(source='product', read_only=True)

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
    # Сериализатор для регистрации
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

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return {'user': user}
        raise serializers.ValidationError("Неверный логин или пароль")
