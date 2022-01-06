import style from './FoodItem.module.scss';
import { useNavigate } from 'react-router-dom';

function FoodItem(props) {
    const navigate = useNavigate();
    return (
        <div className={style.main}>
            <img className={style.img} src={props.image} alt="" />
            <h1>{props.name}</h1>
            {/* onClick sends the user to the path of '/search' + the id of the food item selected */}
            <button className={style.btn} onClick={() => navigate(`/search/${props.id}`)}>See More</button>
        </div>
    )
}

export default FoodItem
