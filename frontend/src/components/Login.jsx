// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'
import './Login.css';
import cover from '../assets/images/cover.webp';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { login, isAuthenticated } = useAuth()
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await login(formData.username, formData.password);
            navigate('/profile');
        } catch (err) {
            setError(err.message)
        }
    }
    // Если уже авторизован, перенаправляем на профиль
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile');
        }
    }, []);

    //Обработка события change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    return (
        <div className="login__form-container">
            <h2>Вход</h2>

            {error && (
                <div className="error-message" style={{
                    color: '#f44336',
                    backgroundColor: '#ffebee',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '15px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            <form className="login__form" onSubmit={handleSubmit}>
                <img
                    src={cover}
                    alt="Форма входа"
                    className="form__decor"
                />

                <label htmlFor="username" className="visually-hidden">
                    Почта или логин
                </label>
                <input
                    type="text"
                    placeholder="Имя пользователя или email"
                    id="username"
                    name="username"
                    value={formData.username}
                    className="input__text-field form__input"
                    onChange={handleChange}
                    disabled={loading}
                    required
                    autoComplete="username"
                />

                <label htmlFor="password" className="visually-hidden">
                    Пароль
                </label>
                <input
                    type="password"
                    placeholder="Пароль"
                    id="password"
                    name="password"
                    value={formData.password}
                    className="input__text-field"
                    onChange={handleChange}
                    disabled={loading}
                    required
                    autoComplete="current-password"
                />
                <button
                    type="submit"
                    className="button login-button"
                    disabled={loading}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </button>
                <span>
                    Нет учётной записи?
                    <a href="/register">
                        Зарегистрироваться
                    </a>
                </span>
            </form>
        </div>
    );
}

export default Login;