import './ProductDetail.css'
import {useState, useEffect} from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom';
import AddToTheCart from '../components/AddToTheCart.jsx'
import GridRow from '../components/GridRow.jsx'
import {useAuth} from '../context/AuthContext'
import api from '../services/api'
import axios from 'axios';

import Comments from '../components/comment/Comments'
import ImageSlider from '../components/image_slider/ImageSlider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductDetail(){
    const queryClient = useQueryClient();
    const { id: productId } = useParams(); // Извлекаем id из параметров URL
    const {user} = useAuth();
    const navigate = useNavigate();

    const {data: product, isLoading,
        error, refetch} = useQuery({
            queryKey: ['product', productId],
            queryFn: async() => {
                const response = await axios.get(
                    `http://127.0.0.1:8000/api/products/${productId}/`);
                return response.data;
            },
            staleTime: 5 * 60 * 1000, // 5 минут данные считаются свежими
            retry: 1,
            enabled: !!productId, // Запрос выполняется только если есть id
    });
    // Загрузка комментариев
    const { data: comments } = useQuery({
        queryKey: ['comments', productId],
        queryFn: async() => {
            const response = await api.get(`/products/${productId}/comments/`);
            return response.data.results || response.data;
        },
        // Кешируем отдельно от товара
        staleTime: 2 * 60 * 1000,
    });

    const { data: images } = useQuery({
        queryKey: ['images', productId],
        queryFn: async() => {
            const response = await api.get(`/products/${productId}/images/`);
            return response.data.results || response.data;
        },
        // Кешируем отдельно от товара
        staleTime: 2 * 60 * 1000,
    });

    const addCommentMutation = useMutation({
        mutationFn: (text) => api.post(`/products/${productId}/comments/`, { text }),
        onSuccess: () => {
            // Инвалидируем только комментарии, не трогаем товар
            queryClient.invalidateQueries(['comments', productId]);
        },
    });

    // Функция для обработки клика по кнопке "Удалить"
    const handleDelete = () => {
        // Перенаправляем на список товаров
        navigate('/products')
        api.delete(`http://127.0.0.1:8000/api/products/${productId}/`)
        .then(res => {
            if (res.ok) {
                console.log("Товар успешно удален");
            } else {
                console.log("Не удалось удалить товар (нет прав)");
            }
        })
        .catch(err => console.log(err));
    };

    if (error) {
        return <div>Товар не найден или произошла ошибка</div>;
    }
    if (!product) {
        return <div>Загрузка...</div>;
    }
    return (
        <div>
            <div className="breadcrumb">
                <Link to="/">Главная</Link>
                <span className="breadcrumb__arrow">&gt;</span>
                <Link to="/products">Каталог</Link>
                <span className="breadcrumb__arrow">&gt;</span>
                <a className="breadcrumb__link--active">{product.title}</a>
            </div>
            <div className="product">
                <section className = "product__section--thumbnail product__section">
                    <img src={product.thumbnail}
                    className="product__img"
                    alt="Изображение товара"/>
                </section>
                <section className="product__section--slider product__section">
                    <ImageSlider images={images} />
                </section>
                <section className = "product__section--info product__section">
                    <h2 className = "product__title">{product.title}</h2>
                    <p className="product__description">
                        {product.description}
                    </p>
                    <p className="product__rating">
                        <strong>Рейтинг:</strong> {product.average_rating} ☆ из 5
                    </p>
                    <p className="product__price">
                        Цена:
                        <span className={`product__price--current
                            ${!product.in_stock ?
                            "product__price--current--not_in_stock" : ""}`}
                        >
                            {product.final_price} Р
                        </span>
                        <span className="product__price--old"
                        style={ !product.discount ? {display: "none"} : {}}>
                            {product.price} Р
                        </span>
                    </p>
                    <div className="product__buttons-controls">
                        <AddToTheCart product={product} />
                        {user?.id == product.user &&
                        <button type="button"
                        className="product__button product__button--delete"
                        onClick={() => handleDelete()}
                        >
                            Удалить товар
                        </button>
                        }
                        {user?.id == product.user &&
                        <a href={`/products/${product.id}/update`}
                        className="product__button product__button--delete"
                        >
                            Редактировать
                        </a>
                        }
                    </div>
                    <section className="product__table">
                        <h3>Информация о товаре:</h3>
                        <GridRow label="В наличии" value={product.in_stock ? "Да" : "Нет"} />
                        <GridRow label="Владелец" value={product.user_name} />
                        <GridRow label="Предназначено для" value={product.animal_title} />
                        <GridRow label="Упаковка" value={product.box_type_name} />
                        <GridRow label="Категория" value={product.category_title} />
                        <GridRow label="Размер животного" value={product.animal_size_name} />
                    </section>
                    <section className="product__comments">
                        <h2 className="comments__title">Отзывы:</h2>
                        <Comments comments={comments} />
                    </section>
                </section>
            </div>
        </div>
    );
}

export default ProductDetail