import './AddToTheCart.css'
import api from '../services/api';
import {useAuth} from '../context/AuthContext';
import {useCart} from '../context/CartContext';
import React, { useState, useEffect } from 'react';
import plusIcon from '../assets/svg/plus.svg'
import minusIcon from '../assets/svg/minus.svg'

function AddToTheCart({product, quantity = 1}){
    const {addToTheCart, updateQuantity, cartData} = useCart();
    const [cartItem, setCartItem] = useState(null);
    useEffect(() =>
    {
        if (cartData && cartData.items && product) {
            const item = cartData.items.find(item => item.product === product.id);
            setCartItem(item || null); // Если не найден - null
        } else {
            setCartItem(null);
        }
    }
    , [cartData, product]);
    function handleClick(){
        addToTheCart({ product: product.id, quantity: quantity });
    }
    function handlePlusClick(){
        updateQuantity({delta: 1, cartItem: cartItem});
    }
    function handleMinusClick(){
        updateQuantity({delta: -1, cartItem: cartItem});
    }
    if(cartItem) {
        return (
            <div className="product__cart_item_controls">
                <p>В корзине:</p>
            <button className="product__cart_item_button
             product__cart_item_button--add" onClick={handlePlusClick}>
                <img src={plusIcon}
                className="product__cart_item_button__icon"/>
             </button>
            <span className="product__cart_item_quantity">{cartItem.quantity} шт.</span>
            <button className="product__cart_item_button
             product__cart_item_button--delete">
                <img src={minusIcon} onClick={handleMinusClick}
                className="product__cart_item_button__icon"/>
             </button>
        </div>);
    }
    return (
        <button className="button button--cart"
        onClick={handleClick} disabled={!product.in_stock}>
            <span className="button--text">
                Добавить в корзину
            </span>
        </button>
    );
}

export default AddToTheCart;