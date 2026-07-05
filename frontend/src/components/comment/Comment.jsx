import './Comment.css'
import {useAuth} from '../../context/AuthContext'
import deleteIcon from '../../assets/svg/delete-icon-black.svg'
import editIcon from '../../assets/svg/edit-icon-black.svg'

export default function Comment({comment}){
    const {user} = useAuth();
    function handleDelete(){
    }
    return(<div className="comment">
        <div className="comment__avatar_and_content">
            <img src={comment.user_detail.avatar}
            className="comment__avatar" alt="Аватар"/>
            <div className="comment__controls">
                <h4>{comment.user_detail.username}</h4>
                <p className="comment__content">{comment.content}</p>
                <p className="comment__rating">{comment.rating} ☆ из 5</p>
            </div>
        </div>
        <div className="comment__date">
            <span>Создано: {comment.created_at}</span>
            <span>Ред. {comment.updated_at}</span>
            <div className="comment__buttons">
                {user && user.id === comment.user &&
                     <button type="button"
                        className="comment__button comment__button--delete"
                        onClick={() => handleDelete()}
                        >
                            <img src={deleteIcon} className="comment__button__icon"/>
                     </button>
                }
                {user && user.id === comment.user &&
                     <button type="button"
                        className="comment__button comment__button--edit"
                        onClick={() => handleDelete()}
                        >
                            <img src={editIcon} className="comment__button__icon"/>
                     </button>
                }
            </div>
        </div>
    </div>);
}