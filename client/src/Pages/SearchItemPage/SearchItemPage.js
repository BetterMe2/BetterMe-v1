//importing React hooks and axios
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

//importing scss module for this SearchItemPage component
import style from './SearchItemPage.module.scss';

//importing Navigation and Footer components
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';

function SearchItemPage() {
  //deconstruct id key from params
  const { id } = useParams();

  //declare new state variable "item", function setItem and setting initial state to null
  const [item, setItem] = useState(null);

  //upon render, send get request to API, setting key-value pair item: response data in the local storage object
  //update item state to the response data
  //not currently working - API requires payment
  useEffect(() => {
    axios
      .get(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=b3dfd59b7c1f48a888d4c0c01d659bf1`)
      .then((res) => {
        console.log(res.data);
        console.log(res.data.summary);
        localStorage.setItem('item', JSON.stringify(res.data));
        setItem(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);
  const user = useSelector((state) => state.user.user);

  //adding favorite foods - not currently working
  const addFav = async () => {
    await axios
      .post(`http://localhost:4000/favorites/${user.user_id}/create`, {
        food_id: id,
      })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  //   const {cheap, summary, dairyFree, sustainable, veryHealth, vegan, vegetarian, nutrition.weightPerServing.amount, nutrition.weightPerServing.unit, readyInMinutes, winePairing.pairingText, pricePerServing, dishTypes, slideIngredients} = item;

  return (
    <>
      <Nav />
      <div className={style.containerMain}>
        <div className={style.main}>
          <div className={style.SearchItemPage}>
            <div className={style.col1}>
              <img src={item ? item.image : ''} alt={item ? item.name : ''} />
            </div>
            <div className={style.col2}>
              <h1 className={style.title}>{item ? item.title : ''}</h1>
              {/* <h1>{item ? item.sourceName : ''}</h1> */}
              <p>{item ? <div className={style.summaryText} dangerouslySetInnerHTML={{ __html: item.summary }}></div> : ''}</p>
            </div>
          </div>
          <div className={style.bottomRow}>
            <ul className={style.category}>
              <li><b>Reasonably Priced:</b> {item && item.cheap ? 'No' : 'Yes'}</li>
              <li><b>Dairy Free:</b> {item && item.dairyFree ? 'No' : 'Yes'}</li>
              <li><b>Is this item sustainable:</b> {item && item.sustainable ? 'No' : 'Yes'}</li>
              <li><b>Very healthy:</b> {item && item.veryHealthy ? 'No' : 'Yes'}</li>
              <li><b>Vegan:</b> {item && item.vegan ? 'No' : 'Yes'}</li>
              <li><b>Vegetarian:</b> {item && item.vegetarian ? 'No' : 'Yes'}</li>
              <li>
                weight per Serving: {item ? item.nutrition.weightPerServing.amount : ''}
                {item ? item.nutrition.weightPerServing.unit : ''}
              </li>
              <li><b>Time to make:</b> {item ? item.readyInMinutes : ''} min</li>
              <li><b>Wine Pairing:</b> {item ? item.winePairing.pairingText : ''}</li>
              <li><b>Price per serving:</b> ${item ? (item.pricePerServing / 100).toFixed(2) : ''}</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default SearchItemPage;
