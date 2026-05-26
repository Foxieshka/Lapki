import './CartItem.css'

function CartItem({cartItem}){
    return (
        <div className="cart_item">
            <img src=""
            alt="Изображение товара"
            className="cart_item-img"/>

            <div className="cart_item-content">
                <p className="cart_item-name">{cartItem.name}</p>
                <span className="cart_item-price">{cartItem.price} Р</span>
                <div className="cart_item-buttons">
                    <button className="cart_item-plus-button
                    cart_item-button">
                        <svg width="24" height="24" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" className="cart_item-plus-icon">
                            <path d="M5 12h14M12 5v14"/>
                        </svg>
                    </button>
                    <span>{cartItem.quantity}</span>
                    <button className="cart_item-minus-button
                    cart_item-button">&mdash;</button>
                </div>
            </div>
        </div>
    );
}

export default CartItem