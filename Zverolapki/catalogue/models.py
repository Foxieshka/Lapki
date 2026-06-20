from django.db import models
from django.db.models import PROTECT, CASCADE
from django.contrib.auth.models import AbstractUser
from math import floor

#Пользователь
class User(AbstractUser):
    avatar = models.ImageField(upload_to="avatars/", null=True,
                               blank=True, verbose_name="Аватар")
    birth_date = models.DateField(blank=True, null=True, verbose_name="Дата рождения")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата регистрации')
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

    def get_avatar_url(self):
        #Безопасное получение URL аватара
        if self.avatar and hasattr(self.avatar, 'url'):
            return self.avatar.url
        return None

    class Meta:
        db_table = 'users'
        verbose_name = 'Пользователь'
        verbose_name_plural = "Пользователи"

#Категория
class Category(models.Model):
    title = models.CharField(max_length=50, verbose_name="Наименование категории", unique=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        db_table = 'categories'

# Товар
class Product(models.Model):
    class AnimalSize(models.TextChoices):
        SMALL = "Small", "Мелкий"
        MEDIUM = "Medium", "Средний"
        LARGE = "Large", "Крупный"

    class BoxType(models.TextChoices):
        POLYMER_BAG = "Polymer_Bag", "Плотный полимерный пакет"
        CARDBOARD_BOX = "Cardboard_Box", "Плотная картонная коробка"
        DOYPACK = "Doypack", "Дой-пак"
        ZIP_BAG = "Zip_bag", "Зип-пакет"
        CAN = "Can", "Консервы"
        PLASTIC_BOTTLE = "Plastic_bottle", "Пластиковая бутылка"

    user = models.ForeignKey(User, on_delete=CASCADE, default=None, verbose_name="Пользователь")
    title = models.CharField(max_length=150, verbose_name="Наименование", db_index=True)
    description = models.TextField(verbose_name="Описание")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    price = models.DecimalField(max_digits=9, decimal_places=3, verbose_name="Цена")
    discount = models.PositiveSmallIntegerField(verbose_name="Скидка", default=0)
    in_stock = models.BooleanField(verbose_name="В наличии", default=True, db_index=True)
    box_type = models.CharField(max_length=30, choices=BoxType.choices, blank=True,
                                verbose_name="Тип упаковки", default=BoxType.DOYPACK)
    thumbnail = models.ImageField(upload_to="products", blank=True, verbose_name="Изображение товара")

    animal = models.ForeignKey('Animal', null=True, verbose_name="Вид животного", on_delete=PROTECT)
    category = models.ForeignKey(Category, null=True, on_delete=CASCADE, verbose_name="Категория")
    animal_size = models.CharField(max_length=20, choices=AnimalSize.choices, blank=True,
                            verbose_name="Размер животного")

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"
        ordering = ['-created_at']
        db_table = 'products'

    def __str__(self):
        return self.title

    def get_final_price(self):
        return int(floor(self.price * (100 - self.discount) / 100))


#Вид животного
class Animal(models.Model):
    title = models.CharField(max_length=150, verbose_name="Наименование", db_index=True)
    description = models.TextField(verbose_name="Описание")
    image = models.ImageField(upload_to='categories/', verbose_name="Изображение")

    class Meta:
        verbose_name = "Вид животного"
        verbose_name_plural = "Виды животных"
        ordering = ['title']
        db_table = 'animals'

    def __str__(self):
        return self.title

# Корзина
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=CASCADE,
                             verbose_name="Пользователь", related_name="cart",
                             null=True, blank=True)
    class Meta:
        db_table = 'carts'
        verbose_name = 'Корзина'
        verbose_name_plural = "Корзины"

# Товар в корзине
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, blank=True, on_delete=CASCADE, related_name="items",
                             verbose_name="Корзина")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")

    def __str__(self):
        return f"{self.quantity} x {self.product.title}"

    def get_total_price(self):
        return self.product.get_final_price() * self.quantity

    class Meta:
        db_table = 'cart_items'
        verbose_name = 'Товар в корзине'
        verbose_name_plural = "Товары в корзине"



