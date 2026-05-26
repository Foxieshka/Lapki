import React, { useState, useEffect } from 'react';
import './Cart.css'
import CartItem from '../components/CartItem.jsx'

const cart_items = [
    {id: 1, name: 'Домик для амадин', quantity: 2, price: 300},
    {id: 2, name: 'Корм для белок', quantity: 1, price: 300},
]

function Cart(){
    // Инициализация корзины из localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : {};
    });

    //Тестовое заполнение данными
    cart_items.forEach(function(item){
        cart[item.id] = item;
    });
    console.log(Object.values(cart));

    // Синхронизация localStorage при изменении корзины
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    //Изменить количество
    const updateQuantity = (productId, delta) => {
        setCart((prev) => {
          const item = prev[productId];
          if (!item) return prev; // Защита: если товара нет, ничего не делаем

          const newQuantity = item.quantity + delta;

          // Если количество стало 0 или меньше — удаляем товар из объекта
          if (newQuantity <= 0) {
            const { [productId]: _, ...rest } = prev; // Деструктуризация для удаления ключа
            return rest;
          }
          // Иначе обновляем количество у конкретного товара
          return {
            ...prev,
            [productId]: { ...item, quantity: newQuantity }
          };
        });
    };
    // Полное удаление товара (кнопка "Удалить")
    const removeItem = (productId) => {
        setCart((prev) => {
            const { [productId]: _, ...rest } = prev;
            return rest;
        });
    };
    // Функция добавления товара из каталога
    const addToCart = (product) => {
        setCart((prev) => {
          const id = product.id;
          // Если товар уже в корзине, увеличиваем на 1, если нет — ставим quantity: 1
          const currentItem = prev[id] || { ...product, quantity: 0 };

          return {
            ...prev,
            [id]: { ...currentItem, quantity: currentItem.quantity + 1 }
          };
        });
    };

    return (<div>
        <h2 className="content__title" style={{textAlign: 'left', fontSize: '2em'}}>Корзина</h2>
        <section className = "cart_items">
            <ul className = "cart_items__list">
                {cart_items.map(function(item){
                    return (<li className="cart_items__list-item">
                        <CartItem key={item.id}
                        cartItem={item} /></li>)
                })}
            </ul>
        </section>
        <section className = "order-details">
        </section>
    </div>);
    }

export default Cart