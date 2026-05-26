// src/components/Login.js
import React, { useState } from 'react';
import API from '../services/api';
import './Login.css'
import cover from '../assets/images/cover.webp'
import CheckBoxCustom from '../components/CheckBoxCustom.jsx'

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //LoginView теперь возвращает access и refresh токены
      const response = await API.post('/auth/login/', {
        username: formData.username,
        password: formData.password
      });

      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setError('Успешный вход!');
        // Перенаправьте пользователя на главную страницу
        window.location.href = '/';
      }
    } catch (err) {
      setError('Неверное имя пользователя или пароль');
    }
  };

  return (
    <div className="login__form-container">
      <h2>Вход</h2>
      <form className="login__form" onSubmit={handleSubmit}>
        <img src={cover}
        alt="Форма входа"
        className="form__decor"/>

        <label htmlFor="username"
        className="visually-hidden">Почта или логин</label>
        <input type="text" placeholder="me@example.com" id="username" name="username"
        className="input__text-field" onChange={handleChange} required/>

        <label htmlFor="password"
        className="visually-hidden">Пароль</label>
        <input type="password" placeholder="Пароль" id="password" name="password"
        className="input__text-field" onChange={handleChange}/>

        <CheckBoxCustom key={1}
        label={"Запомнить меня"}
        value={"agree"} name={"agree"} id={1}/>

        <input className="button login-button"
        type="submit" value="Войти"/>

        <span>Нет учётной записи?
            <a href="/">
                Зарегистрироваться
            </a>
        </span>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;