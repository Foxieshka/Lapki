import './ProductCard.css'
import heart_icon from '../assets/svg/heart_stroke.svg'
import {useParams, Link} from 'react-router-dom'
import AddToTheCart from './AddToTheCart.jsx'

function ProductCard({product}){
    return (<article className = "product-card">
        {product.discount > 0 &&
        <div className="product-card__badge product-card__badge--discount">
            <span className="product-card__badge-text">-{product.discount}%</span>
        </div>
        }
        <img className="product-card__image"
        src={product.thumbnail}
        alt="Изображение товара" />
        <div className="product-card__pricing">
            <span className="product-card__price product-card__price--current">
                {product.final_price} Р
            </span>
            {product.discount > 0 &&
                <span className="product-card__price product-card__price--old">
                    {product.price} Р
                </span>
            }
            <p className="product-card__stock-status
            product-card__stock-status--in-stock">
                {product.in_stock ? "В наличии" : "Нет в наличии"}
            </p>
            <h3 className="product-card__title">
                <Link to={`/products/${product.id}`}>{product.title}</Link>
            </h3>
        </div>
        <AddToTheCart product={product} />
        <button className="button button--like" aria-label="В избранное">
            <span className="visually-hidden">В избранное</span>
            <img src={heart_icon} className="button--like__icon" alt="Иконка сердца"/>
        </button>
    </article>)
}

export default ProductCard
