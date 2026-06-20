import Header from '../components/Header.jsx'
import React, { useState, useEffect } from 'react';
import Banner from '../components/banner/Banner.jsx'
import CategoryCard from '../components/category_card/CategoryCard.jsx'

function Home(){
    const [animals, setAnimals] = useState([]);
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/animals/')
        .then(res => {
            return res.json();
        })
        .then(data => {
            setAnimals(Array.from(data.results));
        })
    }, []); // Пустой массив зависимостей — сработает 1 раз

    return (
        <main>
            <Banner />
            <section className="categories content__section">
                <h2 className="content__title">Категории</h2>
                    <p>Со всеми нашими услугами вы можете ознакомиться в каталоге.</p>
                    <ul className="categories-list">
                        {animals.map(animal => <CategoryCard key={animal.id} category={animal}/>)}
                    </ul>
            </section>
        </main>
    )
}

export default Home