import './CategoryCard.css'

function CategoryCard({category}){
    return (<article className="categories__card">
            <h3 className="categories__card__title">
                {category.title}
            </h3>
            <img
                className="categories__card-img"
                src={category.image}
                alt="Изображение категории"
            />
            <p className="categories__card__description">
                {category.description}
            </p>
    </article>
        )
}

export default CategoryCard