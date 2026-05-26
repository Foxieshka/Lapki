from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from . import views
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CartItemViewSet, WishlistItemViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart-items', CartItemViewSet, basename='cart-items')
router.register(r'wishlist-items', WishlistItemViewSet, basename='wishlist-items')

urlpatterns = [
    # Товары, корзина и избранное
    path('', include(router.urls)),
    # Категории и животные
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('animals/', views.AnimalListView.as_view(), name='animal-list'),
    # Корзина
    path('cart/', views.CartDetailView.as_view(), name='cart'),
    # Избранное
    path('wishlist/', views.WishlistDetailView.as_view(), name='wishlist'),
    # Отзывы
    path('products/<int:product_id>/reviews/',
         views.ReviewListView.as_view(), name='reviews'),
    # Пользователи
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/profile/', views.ProfileUpdateView.as_view(), name='profile'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),

    # Авторизация (JWT токены)
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]