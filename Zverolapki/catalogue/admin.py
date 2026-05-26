from django.contrib import admin
from .models import *

# Register your models here.
class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 1

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user__username',
                    'content', 'rating', 'created_at', 'updated_at')
    list_display_links = ('id', 'user__username')

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')
    list_display_links = ['id', 'title']

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'created_at')
    list_display_links = ('id', 'username')
    date_hierarchy = 'created_at'
    inlines = [ReviewInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'title')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'created_at',
                    'price', 'discount', 'animal', 'category')

    list_display_links = ('id', 'title', 'animal')
    inlines = [ProductImageInline, ReviewInline]

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
    list_display_links = ('id', 'user')
    inlines = [CartItemInline]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity')
    list_display_links = ('id', 'cart', 'product')

@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
    list_display_links = ('id', 'user')
    inlines = [WishlistItemInline]

@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'wishlist', 'product')
    list_display_links = ('id', 'wishlist', 'product')