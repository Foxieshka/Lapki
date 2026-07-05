import './ImageSlider.css'
import {useState, useEffect} from 'react'

export default function ImageSlider({images}){
    const [currentIndex, setCurrentIndex] = useState(0);
    // Функция для перехода к следующему слайду
    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    }
    // Функция для перехода к предыдущему слайду
    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    }
    // Эффект для автоматической смены слайдов
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 3000); // 3000 миллисекунд = 3 секунды

        // Функция очистки: сбрасывает таймер при размонтировании
        // компонента, чтобы избежать утечек памяти
        return () => clearInterval(timer);
    }, [currentIndex]); // Перезапускаем эффект при смене слайда

    if (!images || images.length === 0) return null;

    return (
        <section className="slider">
            {/*   Кнопка "назад"     */}
            <button onClick={prevSlide}
            className="slider__button
            slider__button--prev">
                ❰
            </button>
            {/*   Кнопка "вперед"     */}
            <button onClick={nextSlide}
            className="slider__button
            slider__button--next">
                ❱
            </button>
            <div className="slider__viewport">
            {images.map((image, index) => (
                <div key={index} className="slider__track"
                style={{transform: `translateX(-${currentIndex * 100}%)`}}>
                    <img src={image.content}
                    className="slider__img"
                    alt={`Слайд ${index + 1}`}
                    />
                </div>
            ))}
            </div>
            {/* Индикаторы */}
            <div className="slider__dots">
            {images.map((_, index) => (
                <span
                    key={index}
                    className={`dot ${currentIndex === index ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                />
            ))}
            </div>
        </section>
    );
}