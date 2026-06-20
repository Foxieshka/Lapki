// src/components/Profile.jsx
import './Profile.css';
import React, { useState, useEffect, useRef } from 'react';
import empty_image from '../assets/images/empty.png';
import api from '../services/api';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        birth_date: '',
    });
    const [avatar, setAvatar] = useState(empty_image);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);

    const {login, isAuthenticated, user, logout} = useAuth();
    const navigate = useNavigate();
    // Загрузка профиля при старте
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user) {
            // Заполняем форму данными из контекста
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                birth_date: user.birth_date || '',
            });
            if (user.avatar) {
                setAvatar(user.avatar);
            }
            setLoading(false);
        } else {
            // Если user почему-то нет в контексте, загружаем отдельно
            loadProfile();
        }
    }, [user, isAuthenticated, avatar]);

    const loadProfile = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/auth/profile/');
            setFormData({
                first_name: response.data.first_name || '',
                last_name: response.data.last_name || '',
                email: response.data.email || '',
                birth_date: response.data.birth_date || '',
            });
            console.log(response.data.avatar);
            if (response.data.avatar) {
                setAvatar(response.data.avatar);
            }
        } catch (err) {
            console.error('Ошибка загрузки профиля:', err);
            if (err.response?.status === 401) {
                setError('Сессия истекла. Перенаправление на страницу входа...');
                setTimeout(() => {
                    authService.logout();
                    navigate('/login');
                }, 2000);
            } else {
                setError('Не удалось загрузить профиль. Пожалуйста, обновите страницу.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        if (successMessage) setSuccessMessage('');
    };

 const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setSaving(true);

        try {
            const response = await api.patch('/auth/profile/', {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                birth_date: formData.birth_date
            });
            setSuccessMessage('Профиль успешно обновлен!');
            // Обновляем данные в localStorage вручную
            if (response.data) {
                //const currentUser = authService.getCurrentUser();
                const currentUser = user;
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        email: formData.email,
                        birth_date: formData.birth_date
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            }

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Ошибка сохранения:', err);
            if (err.response?.status === 401) {
                setError('Сессия истекла. Пожалуйста, войдите снова.');
                setTimeout(() => {
                    authService.logout();
                    navigate('/login');
                }, 1500);
            } else if (err.response?.data) {
                const serverErrors = err.response.data;
                const errorMessages = Object.values(serverErrors).flat().join(', ');
                setError(errorMessages || 'Ошибка при сохранении данных');
            } else {
                setError('Не удалось сохранить изменения. Проверьте соединение.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Валидация файла
        if (file.size > 5 * 1024 * 1024) {
            setError('Размер изображения не должен превышать 5MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            setError('Пожалуйста, выберите изображение');
            return;
        }
        // Мгновенный предпросмотр
        setAvatar(URL.createObjectURL(file));
        setError('');
        setSuccessMessage('');

        const data = new FormData();
        data.append('avatar', file);

        api.patch('/auth/profile/', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(res => {
            setSuccessMessage('Аватар успешно обновлен!');
            setTimeout(() => setSuccessMessage(''), 3000);
            if (res.data.avatar) {
                setAvatar(res.data.user.avatar);
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    const updatedUser = {
                        ...currentUser,
                        avatar: {avatar}
                    };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            }
        })
        .catch(err => {
            setError('Не удалось сохранить аватар');
            loadProfile(); // Возвращаем старый аватар
        });
    };

    const handleAvatarDelete = async () => {
        try {
            await api.delete('/auth/profile/avatar/');
            setAvatar('');
            setSuccessMessage('Аватар успешно удален');

            // Обновляем localStorage - удаляем аватар
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                const updatedUser = {
                    ...currentUser,
                    avatar: null
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Ошибка удаления:', err);
            setError('Не удалось удалить аватар');
        }
    };

    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Загрузка профиля...</p>
            </div>
        );
    }

    return (
        <main className="content">
            <h2 className="content__title">Основная информация</h2>

            {/* Сообщения об ошибках и успехе */}
            {error && (
                <div className="error-message" style={{
                    color: '#f44336',
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    borderRadius: '4px',
                    borderLeft: '4px solid #f44336'
                }}>
                    <strong>Ошибка:</strong> {error}
                </div>
            )}

            {successMessage && (
                <div className="success-message" style={{
                    color: '#4caf50',
                    marginBottom: '20px',
                    padding: '10px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '4px',
                    borderLeft: '4px solid #4caf50'
                }}>
                    <strong>Успех!</strong> {successMessage}
                </div>
            )}

            <h3 className="content__title">Аватар</h3>
            <section className="avatar__section">
                <img
                    className="avatar__img"
                    src={`http://127.0.0.1:8000/${avatar}`}
                    alt="Аватар пользователя"
                />
                <button
                    type="button"
                    className="button button-avatar-new button-avatar"
                    onClick={() => fileInputRef.current.click()}
                    disabled={saving}
                >
                    Загрузить новый аватар
                </button>

                <button
                    type="button"
                    className="button button-avatar-delete button-avatar"
                    onClick={handleAvatarDelete}
                    disabled={saving}
                >
                    Удалить аватар
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                    disabled={saving}
                />
            </section>

            <section className="personal-details">
                <h3 className="content__title">Персональные данные</h3>

                <form className="form form__personal-details" onSubmit={handleSubmit}>
                    <label htmlFor="name" className="label">
                        <span className="form__label">Имя</span>
                        <input
                            type="text"
                            id="name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="input input__text-field"
                            required
                            disabled={saving}
                            placeholder="Введите ваше имя"
                        />
                    </label>

                    <label htmlFor="surname" className="label">
                        <span className="form__label">Фамилия</span>
                        <input
                            type="text"
                            id="surname"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="input input__text-field"
                            required
                            disabled={saving}
                            placeholder="Введите вашу фамилию"
                        />
                    </label>

                    <label htmlFor="email" className="label">
                        <span className="form__label">Электронная почта</span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="me@example.com"
                            className="input input__text-field"
                            required
                            disabled={saving}
                        />
                    </label>

                    <label htmlFor="birthdate" className="label">
                        <span className="form__label">Дата рождения</span>
                        <input
                            type="date"
                            id="birthdate"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            className="input input__text-field"
                            required
                            disabled={saving}
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={saving}
                        className="button button__save-changes"
                    >
                        {saving ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                </form>

                <button
                    className="button button__save-changes"
                    onClick={handleLogout}
                    style={{ marginTop: "20px", backgroundColor: '#f44336' }}
                >
                    Выйти
                </button>
            </section>
        </main>
    );
}