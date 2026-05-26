import './ProductDetail.css'
import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';

function ProductDetail(){
    const { id: productId } = useParams(); // Извлекаем id из параметров URL
    const [product, setProduct] = useState({});
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/products/${productId}/`)
        .then(res => {
            return res.json();
        })
        .then(data => {
            setProduct(data);
        })
        .catch(err => {
            console.log("Товар не найден");
        });
    }, [productId]); //Перезапускать запрос, если изменится id в URL

    if (error) {
        return <div className="product">Товар не найден или произошла ошибка</div>;
    }
    if (!product) {
        return <div className="product">Загрузка...</div>;
    }
    return (
        <div className="product">
            <div className = "product__img-section product__section">
                <img src={product.thumbnail}
                className="product__img"
                alt="Изображение товара"/>
            </div>
            <div className = "product__content-section product__section">
                <h1 className = "product__title">{product.title}</h1>
                <h3 className = "product__price">
                    <span>{product.final_price} Р</span> <span>{product.price} Р</span>
                </h3>
                <button className="button button--cart">
                    <span className="button--text">Добавить в корзину</span>
                </button>
                <div>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail