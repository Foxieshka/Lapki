import './Register.css'
import React, { useState } from 'react';
import authService from '../services/authService';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError('Пароли не совпадают');
      return;
    }
    try {
      await authService.register(formData.username, formData.email, formData.password, formData.password2);
      alert('Регистрация успешна! Теперь войдите.');
      window.location.href = '/login';
    } catch (err) {
      setError('Ошибка при регистрации');
    }
  };

  // Ваша разметка формы...
  return (
  );
}

