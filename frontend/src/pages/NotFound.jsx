export default function NotFound(){
    return (
        <div>
            <h1 style={{fontSize: '160px',
                color: 'white', WebkitTextStroke: '2px green',
                marginBlock: '20px', lineHeight: '0.9'}}>
                404
            </h1>
            <h3>Страница не найдена</h3>
            <p>К сожалению, неправильно набран адрес,
                или такой страницы больше не существует
            </p>
            <a className="" href="/">На главную</a>
        </div>
        );
}