# permissions.py
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Кастомное разрешение:
    - Безопасные методы (GET, HEAD, OPTIONS) разрешены всем
    - Для изменения (PUT, PATCH, DELETE) нужно быть автором объекта
    """
    def has_object_permission(self, request, view, obj):
        # Чтение разрешено всем
        if request.method in permissions.SAFE_METHODS:
            return True

        #Запись разрешена только автору поста
        return obj.user == request.user


class IsOwner(permissions.BasePermission):
    """
    Только владелец объекта имеет доступ
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Администраторы могут менять, остальные только читать
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff