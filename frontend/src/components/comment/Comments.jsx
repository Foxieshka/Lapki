import './Comments.css'
import Comment from './Comment.jsx'
import { useFormik } from 'formik';
import {useAuth} from '../../context/AuthContext'
import * as yup from 'yup';

// Создаем схему валидации с помощью Yup
const commentCreateSchema = yup.object().shape({
    content: yup.string().min(2, "Отзыв должен содержать как минимум 2 символа.")
    .max(150, "Отзыв не может быть больше 150 символов.").required('Заполните поле ввода.'),
    rating: yup.number()
    .notRequired()
    .min(0, "Рейтинг не может быть меньше 0.")
    .max(5, "Рейтинг не может быть больше 5")
});

export default function Comments({comments}){
    const formik = useFormik({
        initialValues: {
            content: '',
            rating: 0,
        },
        enableReinitialize: true,
        validationSchema: commentCreateSchema, // Подключаем схему Yup
        onSubmit: async(values) => {
            
        }
    });
    const {isAuthenticated} = useAuth();
    return (
         <div className="comments">
             <h2 className="comments__title">Отзывы:</h2>
             {!isAuthenticated &&
                 <div className="login_or_register">
                     <p>Войдите или зарегистрируйтесь, чтобы оставить отзыв.</p>
                 </div>
             }
             {isAuthenticated && <form className="form--comment" noValidate>
                <h3>Напишите ваш отзыв: </h3>
                {/* Поле ввода комментария */}
                <label htmlFor="content" className="form__label">
                    <textarea
                        id="content"
                        name="content"
                        onChange={formik.handleChange}
                        value={formik.values.content}
                        onBlur={formik.handleBlur}
                        className="form__textarea"
                        required
                        placeholder="Текст сообщения... "
                        cols="50"
                        rows="5"
                        noValidate
                    />
                    <p className="form-error">{formik.errors.content}</p>
                </label>
                {/* Поле ввода рейтинга */}
                <label htmlFor="rating" className="form__label"
                style={{width: '18rem'}}>
                    <input
                        id="rating"
                        name="rating"
                        onChange={formik.handleChange}
                        value={formik.values.rating}
                        onBlur={formik.handleBlur}
                        className="form__input form__input_type_number"
                        type="number"
                        placeholder="Рейтинг... "
                        noValidate
                    />
                    <p className="form-error">{formik.errors.rating}</p>
                </label>
                {/* Кнопка отправки */}
                <button
                    type="submit"
                    className="button form__button"
                >
                    Отправить
                </button>
             </form>}
             {(!comments || comments.length === 0) &&
                 <p>В отзывах пока пусто.</p>}
             <ul className="comments__list">
                {comments && comments.map(item => <li className="comments__list_item"
                    key={item.id}><Comment comment={item} /></li>)}
             </ul>
         </div>
    );
}