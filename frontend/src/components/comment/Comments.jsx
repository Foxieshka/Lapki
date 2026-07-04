import './Comments.css'
import Comment from './Comment.jsx'

export default function Comments({comments}){
    if(!comments || comments.length === 0){
        return <div className="comments">В отзывах пока пусто.</div>
    }
    return (
         <div className="comments">
             <ul className="comments__list">
                {comments.map(item => <li className="comments__list_item"
                    key={item.id}><Comment comment={item} /></li>)}
             </ul>
         </div>
    );
}