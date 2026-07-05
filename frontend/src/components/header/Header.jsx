import {Link} from 'react-router-dom'
import './Header.css'
import authService from '../../services/authService.js'
import React, { useState, useEffect } from 'react';

function Header(){
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    useEffect(() => {
        // Проверяем каждые 100 мс
        const interval = setInterval(() => {
            setIsAuthenticated(authService.isAuthenticated());
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
        <div className="header__row">
            <div className="header__title">
                <h1 className="header__title">
                    Зверятки
                </h1>
            </div>

{/*             <form className="form search-form"> */}
{/*                 <input type="search" className="search-field" */}
{/*                    placeholder="Поиск товаров..." id="search-field" /> */}
{/*                 <input type="submit" className="button search-button" */}
{/*                 value="" id="search-submit"/> */}
{/*             </form> */}
        </div>

        <nav className="header__navigation navigation">
            <ul className="navigation__list">
                <li className="navigation__list-item">
                    <Link to="/" className="navigation__link">
                        Главная
                    </Link>
                </li>
                <li className="navigation__list-item">
                    <Link to="/Products" className="navigation__link">
                        Каталог
                    </Link>
                </li>

                <li className="navigation__list-item">
                    {/* Условный рендеринг: Если залогинен — Профиль, если нет — Вход */}
                    {isAuthenticated ? (
                        <Link to="/profile" className="navigation__link">
                            Профиль
                        </Link>
                    ) : (
                        <Link to="/Login" className="navigation__link">
                            Вход
                        </Link>
                    )}
                </li>
                <li className="navigation__list-item">
                    <a href="/Cart" className="navigation__link">
                        Корзина
                    </a>
                </li>
                <li className="navigation__list-item">
                    <a href="/create_product" className="navigation__link">
                        Добавить товар
                    </a>
                </li>
            </ul>
        </nav>
    </header>
        )
    }

export default Header