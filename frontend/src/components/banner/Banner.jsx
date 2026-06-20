import './Banner.css'
import cover from '../../assets/images/cover.webp'

function Banner(){
    return (
        <section className="cover content__section" style={{backgroundImage: `url(${cover})`}}>
            <h1 className="cover__title">
                <span className="aligned__text aligned__text-left">
                    <span className="letter__spacing-extended">Добр</span>
                    <span className="no-letter-spacing">о</span>
                </span>
                <span className="aligned__text aligned__text-center">
                    <span className="letter__spacing-extended">Пожаловать</span>
                    <span className="no-letter-spacing">в</span>
                </span>
                <span className="aligned__text aligned__text-right">
                    <span className="letter__spacing-extended">"Зверятки</span>
                    <span className="no-letter-spacing">"</span>
                </span>
            </h1>
            <div className="cover__description">
                <p className="cover__description-text">
                    Широкий ассортимент товаров для ваших питомцев
                </p>
                <button className="cover__button">
                    Перейти к категориям
                </button>
            </div>
        </section>
    )
}

export default Banner