import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx'
import CheckBoxCustom from '../components/CheckBoxCustom.jsx'
import './Products.css'
import axios from 'axios';

function Products(){
    //Создаем стейты для хранения данных из API
    const [products, setProducts] = useState([]);
    const [animals, setAnimals] = useState([]);
    const [categories, setCategories] = useState([]);

    // Стейты для выбранных фильтров (массивы значений)
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    //Стейты для поиска и процесса загрузки
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('')

    // Делаем запросы к Django при монтировании компонента
    useEffect(() => {
        // Функция для параллельного получения всех данных
        const fetchData = async () => {
            try {
                setLoading(true);
                const [animalsRes, categoriesRes, productsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/animals/'),
                    axios.get('http://127.0.0.1:8000/api/categories'),
                    axios.get('http://127.0.0.1:8000/api/products')
                ]);
                // Записываем данные в соответствующие стейты
                setAnimals(animalsRes.data.results || animalsRes.data);
                setCategories(categoriesRes.data.results || categoriesRes.data);
                setProducts(productsRes.data.results || productsRes.data);
            } catch (err) {
                setError("Не удалось загрузить данные с сервера.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Пустой массив зависимостей — сработает 1 раз

    // Эффект для динамической отправки фильтров на бэкенд при их изменении
    useEffect(() => {
        // Пропускаем первый рендер, когда данные еще загружаются
        if (loading) return;
        const fetchFilteredProducts = async () => {
            try {
                // Формируем объект с фильтрами для отправки в Django кастомный action
                const filters = {
                    animals: selectedAnimals,
                    categories: selectedCategories
                };
                const response = await fetch('http://127.0.0.1:8000/api/products/filters/',
                {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(filters)
                })
                .then(data => {
                    return data.json();
                })
                .catch(error => {
                    alert('Не удалось загрузить фильтры.');
                });
                //setProducts(response.data.results || response.data);
                setProducts(response);
            } catch (err) {
                alert('Не удалось применить фильтры.');
            }
        };
        fetchFilteredProducts();
    }, [selectedAnimals, selectedCategories]); // Срабатывает каждый раз при клике на чекбоксы

    // Обработчики переключения чекбоксов
    const handleAnimalChange = (event) => {
        const { value, checked } = event.target;
        setSelectedAnimals(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };

    const handleCategoryChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCategories(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()))

    // Обработка интерфейса во время загрузки или ошибки
    if (loading) return <main><h2 style={{textAlign: 'center', marginTop: '50px'}}>Загрузка товаров...</h2></main>;
    if (error) return <main><h2 style={{textAlign: 'center', color: 'red', marginTop: '50px'}}>{error}</h2></main>;
    return (
        <main>
            <h1 className="content__title" style={{marginTop: 0, fontSize: '50px'}}>Наши товары</h1>
            <section className="search-sorting-section">
                <form className="sorting-form">
                    <label htmlFor="sorting-select">Сортировать по:</label>
                    <select name="sort" id="sorting-select" className="sorting-form__select">
                        <option value="">Не сортировать</option>
                        <option value="new">Новинки</option>
                        <option value="cheap">Дешевле</option>
                        <option value="expensive">Дороже</option>
                    </select>
                </form>
                <input type="text" placeholder="Поиск..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{padding: '0.5rem', width:'200px'}} name="search"/>
            </section>

            <section className="filters-section">
                <form className="filters-form" name="animals">
                    <h3 className="filters-form__title">Для кого ищете?</h3>
                    <div className="filters-form__group">
                    {animals.map(animal =>
                        (
                        <CheckBoxCustom key={animal.id} label={animal.title} value={animal.title}
                        id={`animal-${animal.id}`} name="animal" onChange={handleAnimalChange}/>
                        ))}
                    </div>
                </form>
                <form className="filters-form" name="categories">
                    <h3 className="filters-form__title">Категории товаров:</h3>
                    <div className="filters-form__group">
                    {categories.map(category => (
                    <CheckBoxCustom key={category.id} label={category.title} value={category.title}
                        id={`category-${category.id}`} name="category" onChange={handleCategoryChange}/>
                    ))}
                    </div>
                </form>
            </section>
            <section className="products-section">
                <ul className="products-grid">
                {!filteredProducts.length && <h2>По данному запросу товары не найдены.</h2>}
                {filteredProducts.map(product => (<li className="products-grid__item">
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                </li>
                ))}
                </ul>
            </section>
        </main>
    )
}

export default Products