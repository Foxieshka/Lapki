// src/components/Register.js
import React, { useState } from 'react';
import './Register.css'
import { useAuth } from '../contexts/AuthContext'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Убедимся, что пароли совпадают
    if (formData.password !== formData.password2) {
      setMessage('Пароли не совпадают');
      return;
    }

    try {
      // Отправляем POST-запрос к вашему RegisterView
      const response = await API.post('/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.password2
      });

      // Если регистрация успешна, ваш RegisterView возвращает токены
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        setMessage('Регистрация успешна!');
        // Перенаправьте пользователя, например, на страницу логина
        // window.location.href = '/login';
      }
    } catch (error) {
      console.error(error);
      setMessage('Ошибка регистрации. Проверьте данные.');
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Имя пользователя" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
        <input name="password2" type="password" placeholder="Подтвердите пароль" onChange={handleChange} required />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;