import {useParams} from 'react-router-dom'

function ProductDetail() {
    const {id} = useParams() //Получаем параметр из url
    return <div>Вы смотрите товар с ID: {id}</div>
}