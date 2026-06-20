from django.contrib import admin
from .models import *

# Register your models here.
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    list_display_links = ['id', 'title']

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'created_at')
    list_display_links = ('id', 'username')
    date_hierarchy = 'created_at'

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'created_at',
                    'price', 'discount', 'animal', 'category')

    list_display_links = ('id', 'title', 'animal')

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
    list_display_links = ('id', 'user')
    inlines = [CartItemInline]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity')
    list_display_links = ('id', 'cart', 'product')
