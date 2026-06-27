import './AddToTheCart.css'
import api from '../services/api';
import {useAuth} from '../context/AuthContext';
import {useCart} from '../context/CartContext';
import React, { useState, useEffect } from 'react';

function AddToTheCart({product, quantity = 1}){
    const {addToTheCart} = useCart();
    function handleClick(){
        addToTheCart({ product: product.id, quantity: quantity });
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