from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # Товары
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<int:id>/', views.ProductDetailView.as_view(), name='product-detail'),
    # Категории и животные
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('animals/', views.AnimalListView.as_view(), name='animal-list'),
    # Корзина
    path('cart/', views.CartView.as_view(), name='cart'),
    path('cart/items/<int:item_id>/', views.CartItemDeleteView.as_view(),
         name='cart-item-delete'),
    # Избранное
    path('wishlist/', views.WishlistView.as_view(), name='wishlist'),
    # Отзывы
    path('products/<int:product_id>/reviews/',
         views.ReviewListView.as_view(), name='reviews'),
    # Пользователи
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    # Авторизация (JWT токены)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]