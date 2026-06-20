import './CartItem.css'
import api from '../services/api'

function CartItem({cartItem}){
    const updateQuantity = async(delta) => {
        const newQuantity = cartItem.quantity + delta;
        if(newQuantity <= 0){
             api.delete(`/cart-items/${cartItem.id}/`)
             .then(response => {
                console.log(response);
                return response.data;
             })
            .catch(err => {
                console.log(err)
            })
            return;
        }
        api.patch(`/cart-items/${cartItem.id}/`,
            { quantity: newQuantity })
        .then(response => {
            return response.data;
        })
        .then(data => {
            return data
        })
        .catch(err => {
            console.log(err)
        })
    }
    return (
        <div className="cart_item">
            <img src={cartItem.product_detail.thumbnail}
            alt="Изображение товара"
            className="cart_item-img"/>

            <div className="cart_item-content">
                <p className="cart_item-title">{cartItem.product_detail.title}</p>
                <span className="cart_item-price">{cartItem.total_price} Р</span>
                <div className="cart_item-buttons">
                    <button className="cart_item-plus-button
                    cart_item-button">
                        <svg width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="cart_item-plus-icon"
                        onClick={() => updateQuantity(1)}>
                            <path d="M5 12h14M12 5v14"/>
                        </svg>
                    </button>
                    <span>{cartItem.quantity}</span>
                    <button className="cart_item-minus-button
                    cart_item-button"
                    onClick={() => updateQuantity(-1)}>
                    &mdash;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CartItem