import './AddToTheCart.css'
import React from 'react'

function AddToTheCart({product, quantity = 1}){
    const token = localStorage.getItem('access_token');
    // Получение корзины из localStorage
    function getCart() {
        const savedCart = localStorage.getItem('guest_cart');
        return savedCart ? JSON.parse(savedCart) : {};
    }
    // Сохранение корзины в localStorage
    function saveCart(cart) {
        localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
    function handleClick(){
        // Проверка наличия товара
        if (!product.in_stock) {
            alert("Товара нет в наличии!");
            return;
        }
        // Для авторизованных пользователей
        if (token) {
            fetch("http://127.0.0.1:8000/api/cart-items/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product: product.id,
                    quantity: quantity
                })
            })
            .then(response => {
                if (response.ok) {
                    alert("Товар добавлен в корзину!");
                } else if (response.status === 401) {
                    alert("Сессия истекла. Войдите снова.");
                    window.location.href = 'http://localhost:5173/login';
                } else {
                    alert("Ошибка при добавлении товара");
                }
            })
            .catch(error => {
                console.error("Ошибка:", error);
                alert("Ошибка при добавлении товара");
            });
        }
        // Для неавторизованных пользователей
        else {
            const cart = getCart();
            if (cart[product.id]) {
                cart[product.id].quantity += quantity;
            } else {
                cart[product.id] = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: quantity
                };
            }
            saveCart(cart);
            alert("Товар добавлен в корзину!");
        }
    }

    return (
        <button className="button button--cart" onClick={handleClick} disabled={!product.in_stock}>
            <span className="button--text">Добавить в корзину</span>
        </button>
    );
}

export default AddToTheCart;