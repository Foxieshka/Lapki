// src/services/api.js
import axios from 'axios';

const API = axios.create({
    //baseURL: '/api', // Прокси сам подставит http://localhost:8000
    baseURL: 'http://localhost:8000/api',
});

// Перехватчик запросов: добавляет токен в заголовок Authorization
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token'); // Или sessionStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;