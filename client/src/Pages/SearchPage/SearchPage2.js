import { useEffect, useRef, useState } from 'react';
import foodArr from '../../images/foodAsort.jpg';
import axios from 'axios';

import style from './SearchPage.module.scss';
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import FoodItem from '../../Components/FoodItem/FoodItem';

import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';


function SearchPage2() {

    //looks inside the params for queries
    let search = window.location.search;
    let params = new URLSearchParams(search);

    //if there are any of the 4 queries from searchItem, parse it out here
    let cuisine = params.get('cuisines');
    let diet = params.get('diets');
    let type = params.get('dishTypes');
    let occasion = params.get('occasions');

    //new query is boolean. double bang to strictly become true or false
    let newQuery = !!(cuisine || diet || type || occasion);
    console.log(`New Query? `, newQuery);

    //shows the search term for troubleshooting
    let newQueryString = (cuisine || diet || type || occasion);
    console.log(`New Query String? `, newQueryString);

    //store in local storage the incoming search term. Not sure why cuisine doesn't work and why !!cuisine does. Does it need an explicit true?
    switch (newQuery) {
        case !!cuisine: {localStorage.setItem('searchItemQuery', 'cuisine'); break}
        case !!diet: {localStorage.setItem('searchItemQuery', 'diet'); break}
        case !!type: {localStorage.setItem('searchItemQuery', 'type'); break}
        case !!occasion: {localStorage.setItem('searchItemQuery', 'query'); break}
        default: {}
    }
    //store search term
    if (newQuery) localStorage.setItem('searchItemTerm', cuisine || diet || type || occasion)   

    //creates a biscuit that will prepopulate the state
    let biscuit; 
    if (localStorage.getItem('searchFetch')) biscuit = JSON.parse(localStorage.getItem('searchFetch')).results

    //set states
    const [data, setData] = useState(biscuit || null);
    const [query, setQuery] = useState(newQuery || null);
    const [searchTerm, setSearchTerm] = useState(biscuit || null)
    const [searchResultsDiv, setSearchResultsDiv] = useState('')

    useEffect(() => {
        // if there is no item in client's local storage or if there are query parameters, get new query
        if (!localStorage.getItem('searchFetch') || newQuery) {

            //create a query string
            let axiosQuery = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=26748879c2274edbba7eba0657fce8a0&number=50'

            //add on all query parameters
            if (cuisine) axiosQuery += `&cuisine='${cuisine}'`
            if (diet) axiosQuery += `&diet='${diet}'`
            if (type) axiosQuery += `&type='${type}'`
            if (occasion) axiosQuery += `&query='${occasion}'`
            console.log(axiosQuery);

            //query
            axios.get(axiosQuery)
                .then(res => {
                    console.log(res.data)
                    // store the latest search to localstorage
                    localStorage.setItem('searchFetch', JSON.stringify(res.data));
                    //set state to the results
                    setData(res.data.results);
                    //generate results header specifying it's a new query
                    generateSearchResultsHeader(true);
                })
                .catch(err => console.log(err))
            return () => {
                // cleanup
            }
        }
        else console.log(`Using old data`)
        //using the previous search results and showing that they're old search results
        generateSearchResultsHeader(false);
    }, []);

    //this initializes the search bar reference
    const Search = useRef(null);
    
    const createSearch = async () => {
        console.log('new search request')
        //creates a new search request
        let queryString = `https://api.spoonacular.com/recipes/complexSearch?apiKey=26748879c2274edbba7eba0657fce8a0&number=50&query=${Search.current.value}`
        console.log(queryString)
        await axios.get(queryString)
            .then((res) => {
                //stores a bunch of stuff in localStorage
                localStorage.setItem('searchFetch', JSON.stringify(res.data));
                localStorage.setItem('searchItemTerm', Search.current.value);
                localStorage.setItem('searchItemQuery', 'query')
                //sets data in state to new results
                setData(res.data.results)
            })
            //generate a search header shwoing new search
            .then(() => generateSearchResultsHeader(true))
            .catch(err => console.log(err))
    }

    //this generates a search results header
    const generateSearchResultsHeader = (newSearch) => {
        console.log(`generating search result header`);
        let text = ''
        // if newQuery or newSearch then show it's a new search
        if ((newQuery || newSearch) && localStorage.getItem('searchItemTerm')) text = 'Looking for ' + localStorage.getItem('searchItemTerm') + ' recipes';
        // if old query and localStorage has pre search results, show that
        else if (localStorage.getItem('searchFetch') && localStorage.getItem('searchItemTerm')) text = `Here's your previous search results for ${localStorage.getItem('searchItemTerm')} recipes`
        // set the state to the text
        setSearchResultsDiv(text);
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
                <h3>{searchResultsDiv}</h3>
                <div className={style.container}>
                    {data && data.map((item, idx) => {
                        return <FoodItem key={idx + 'a'} id={item.id} name={item.title} image={item.image} />
                    })}
                </div>
            </div>
            <br />
            <br />
            <Footer />
        </>
    )
}

export default SearchPage2
