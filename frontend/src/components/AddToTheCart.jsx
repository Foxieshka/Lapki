import './AddToTheCart.css'
import api from '../services/api';
import {useAuth} from '../context/AuthContext';
import {useCart} from '../context/CartContext';
import React, { useState, useEffect } from 'react';
import plusIcon from '../assets/svg/plus.svg'
import minusIcon from '../assets/svg/minus.svg'

function AddToTheCart({product, quantity = 1}){
    const {addToTheCart, cartData} = useCart();
    function handleClick(){
        addToTheCart({ product: product.id, quantity: quantity });
        setInCart(true);
    }
    function handlePlusClick(){
    }
    function handleMinusClick(){
    }
    const [inCart, setInCart] = useState(false);
    if(inCart) {
        return (
            <div className="product__cart_item_controls">
                <p>В корзине:</p>
            <button className="product__cart_item_button
             product__cart_item_button--add" onClick={handlePlusClick}>
                <img src={plusIcon}
                className="product__cart_item_button__icon"/>
             </button>
            <span className="product__cart_item_quantity">5 шт.</span>
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