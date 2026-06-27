import React, { useState, useEffect } from 'react';
import './Cart.css';
import CartItem from '../components/CartItem.jsx';
import api from '../services/api';
import {useAuth} from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Cart() {
    const { cartData, isLoading, error } = useCart();  // используем контекст
    const [cartItems, setCartItems] = useState([]);
    const { login, isAuthenticated } = useAuth();
    useEffect(() => {
        if(cartData){
            setCartItems(cartData.items);
        }
    }, [cartData]);
    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <div className="cart_container">
            <h2 className="cart_container__link">
                <a href="/products">
                    &#10094; Продолжить покупки
                </a>
            </h2>
            <h2 className="cart_container__title">Корзина</h2>
            <p>В корзине {cartData.total_quantity} товаров</p>
            {cartItems.length == 0 &&
                <div className="cart_container__content">
                    <h3>В корзине пока пусто</h3>
                    <a href="/products">Перейти в каталог</a>
                </div>
            }
            {cartItems.length > 0 &&
            <div className="cart_container__content">
                <ul className="cart_items__list">
                    { cartItems.map(cartItem => {
                        return <li key={cartItem.id} className="cart_items__list-item">
                            <CartItem cartItem={cartItem}/>
                            </li>
                    })}
                </ul>
                <div className="cart-container__summary">
                    <h2>К оплате: {cartData.total_price}Р</h2>
                    <button className="button cart-container__button" type="button">
                        <span>Заказать</span>
                    </button>
                </div>
            </div>
            }
        </div>
    );
}

export default Cart;