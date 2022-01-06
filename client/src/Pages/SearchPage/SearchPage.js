//importing React hooks and axios
import { useEffect, useRef, useState } from 'react';
import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';
import axios from 'axios';

//importing scss module for this SearchPage component and image
import style from './SearchPage.module.scss';
import foodArr from '../../images/foodAsort.jpg';

//importing Navigation, Footer, and FoodItem components
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import FoodItem from '../../Components/FoodItem/FoodItem';

function SearchPage() {

    let biscuit;
    //check if searched item is in local storage, if so assign to biscuit variable
    if (localStorage.getItem('searchFetch')) {
        biscuit = JSON.parse(localStorage.getItem('searchFetch')).results;
        console.log('already have this data');
    }

    //declare new state variable "data", function setData and setting initial state to "biscuit" or null
    const [data, setData] = useState(biscuit || null);

    //upon render, if there is search item is not in local storage, send get request to API
    //store response item in local storage object
    //update data state to response item
    useEffect(() => {
        // effect
        if (!localStorage.getItem('searchFetch')) {
            console.log('making a new fetch request -- nothing is cached');
            axios.get('https://api.spoonacular.com/recipes/complexSearch?apiKey=b3dfd59b7c1f48a888d4c0c01d659bf1&number=50')
                .then(res => {
                    console.log(res.data)
                    localStorage.setItem('searchFetch', JSON.stringify(res.data));
                    setData(res.data.results);
                })
                .catch(err => console.log(err))
            return () => {
                // cleanup
            }
        }
    }, []);

    //assign current property in useRef object the value of null
    const Search = useRef(null);

    //send get request to API and add key-value pair of searchFetch: response item in local storage object
    //update data state to the response items
    const createSearch = async () => {
        //console.log('let get your data')
        await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=b3dfd59b7c1f48a888d4c0c01d659bf1&number=50&query=${Search.current.value}`)
            .then((res) => {
                console.log(res.data);
                localStorage.setItem('searchFetch', JSON.stringify(res.data));
                // console.log(res.data)
                setData(res.data.results)
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            <Nav transition={true} />
            <div>
                <div className={style.Hero} style={{backgroundImage: `url(${foodArr})`}}>
                    <h1>Find Your Next Meal</h1>
                    <div className={style.Bar}>
                        <input ref={Search} type="text" placeholder='Enter A Name And We Will help you to your next meal...' />
                        <Icon
                            onClick={createSearch}
                            className={style.search}
                            path={mdiMagnify}
                            size={1.5}
                        />
                    </div>
                </div>
            </div>
            <br />
            <div className={style.content}>
                <div className={style.container}>
                    {data && data.map((item, idx) => {
                        return <FoodItem key={idx} id={item.id} name={item.title} image={item.image} />
                    })}
                </div>
            </div>
            <br />
            <br />
            <Footer />
        </>
    )
}

export default SearchPage
