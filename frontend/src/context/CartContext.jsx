import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchCartData = async() => {
    const response = await api.get("/cart/");
    return response.data;
}

//Создаем контекст с дефолтным значением
const CartContext = createContext();

//Создаем провайдер для обертки приложения
export const CartProvider = ({ children }) => {
    const queryClient = useQueryClient();
    // Получение данных корзины
    const {data: cartData, isLoading, error} = useQuery({
        queryKey: ["cartData"],
        queryFn: fetchCartData
    });
    // Мутация: добавить в корзину
    const addToCartMutation = useMutation({
        mutationFn: async (item) => {
          const res = await api.post('/cart-items/',  {
            product: item.product,
            quantity: item.quantity || 1
          });
          return res.data;
        },
        onSuccess: () => {
          // Обновляем кэш, чтобы UI отобразил актуальные данные
          queryClient.invalidateQueries({ queryKey: ['cartData'] });
        }
    });
    // Мутация: изменить количество товара в корзине
    const updateQuantityMutation = useMutation({
        mutationFn: async ({ delta, cartItem }) => {
            const newQuantity = cartItem.quantity + delta;
            if (newQuantity <= 0) {
                const response = await api.delete(`/cart-items/${cartItem.id}/`);
                return response.data;
            }
            const response = await api.patch(`/cart-items/${cartItem.id}/`, {
                quantity: newQuantity
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cartData'] });
        }
    });
    // Мутация: удалить из корзины
    const removeFromCartMutation = useMutation({
        mutationFn: async (itemId) => {
            const response = await api.delete(`/cart-items/${itemId}/`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cartData'] });
        }
    });
    const value = {
        cartData,
        isLoading,
        error,
        addToTheCart: addToCartMutation.mutate,
        removeFromCart: removeFromCartMutation.mutate,
        updateQuantity: updateQuantityMutation.mutate,
    };
    return <CartContext.Provider value={value}>
        {children}
    </CartContext.Provider>
}

// Создаем кастомный хук для удобства использования
export const useCart = () => useContext(CartContext);