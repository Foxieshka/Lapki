import './Footer.css'
import vk_icon from '../assets/svg/social-media/vk_white.svg'
import yt_icon from '../assets/svg/social-media/yt_white.svg'
import pin_icon from '../assets/svg/social-media/pinterest_white.svg'
import {Link} from 'react-router-dom'

function Footer(){
    return(
        <footer className="footer">
        <address className="address footer__address">
            <a href="tel:+70000000">+7 918 878 69 62</a><br/>
            <a href="mailto:aliya_kakabayeva@vk.com">aliya_kakabayeva@vk.com</a>
            <p>
                г. Ставрополь,
                <br/>
                ул. Ленина, д. 482/1, кв. 33
            </p>
        </address>
        <nav className="footer__menu">
            <ul className="menu__list footer__menu__list">
                <li className="menu__list-item
                footer__menu__list-item">
                    <Link to="/">Главная</Link>
                </li>
                <li className="menu__list-item footer__menu__list-item">
                    <Link to="/products">Каталог</Link>
                </li>
{/*                 <li className="menu__list-item */}
{/*                 footer__menu__list-item"> */}
{/*                     <a className="menu__link menu__link-active"> */}
{/*                         Вход */}
{/*                     </a> */}
{/*                 </li> */}
            </ul>
        </nav>
        <ul className="social__media-list footer__social__media">
            <li className="social__media-list__item">
            <a className="social__media-link" href="https://vk.com/foxieshka">
                <img className="social__media-icon"
                src={vk_icon}
                alt="Иконка ВК"/>
            </a>
            </li>
            <li className="social__media-list__item">
            <a className="social__media-link" href="https://ru.pinterest.com/dreamfury27/">
                <img className="social__media-icon"
                src={pin_icon}
                alt="Иконка Пинтерест"/>
            </a>
            </li>
            <li className="social__media-list__item">
            <a className="social__media-link" href="#">
                <img className="social__media-icon"
                src={yt_icon}
                alt="Иконка Ютуб"/>
            </a>
            </li>
        </ul>
    </footer>
    )
}

export default Footer