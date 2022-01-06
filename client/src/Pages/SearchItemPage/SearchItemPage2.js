import style from './SearchItemPage2.module.scss';
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import popularPng from '../../images/thumbsUp.png'


import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser'

function SearchItemPage2() {

    // need hte id for local storage differentiation
    const { id } = useParams();

    // set up state
    const [item, setItem] = useState(null);
    const [ingredientList, setIngredientList] = useState(null);
    const [instructionList, setInstructionList] = useState(null);
    const [resources, setResources] = useState(null);
    const [nData, setNData] = useState(null);

    //on load
    useEffect(() => {
        //other api: 8b7925686669415ab2aea13ffbeb8b26 a55ef03413ed41f996c002316020cdde 9121a52adb17443599642754ab325300 26748879c2274edbba7eba0657fce8a0 cf9fb61fe4994905968043cba6d86af6 
        // gets the item from localstorage if it exists
        const localStorageItem = localStorage.getItem('item'+id);
        
        // if there is no item fro storage get it
        if (localStorageItem === null) {
            axios.get(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=cf9fb61fe4994905968043cba6d86af6`)
                .then(res => {
                    //labeling them so it's easier to read
                    const jsonString = JSON.stringify(res.data);
                    const items = JSON.parse(jsonString)

                    // console.log(`jsonString: ${jsonString}`);
                    // console.log(`items: ${items}`);
                    // console.log(`storing data in localStorage and state...`);

                    //saving a json string to client local storage
                    localStorage.setItem('item'+id, jsonString);  
                    localStorage.setItem('item', jsonString);  


                    //saving an obj to local state "item"
                    setItem(items);
                    // console.log(`state: item: ${item}`)

                    //return res for future usage
                    return res;
                })
                .then(res => {
                    console.log(`item info: ${res.data}`);
                    console.log(`storing data in ingredientList`);

                    //using an object to create the list of ingredients and set state to render
                    const list = createIngredientList(res.data);
                    setIngredientList(list);

                    //creates the instruction list from the data and saves to state to render
                    const instructionList = createInstructionList(res.data);
                    setInstructionList(instructionList);

                    //creates the resource links and saves to state to render
                    const resources = getAllLinks(res.data);
                    setResources(resources);

                    const nutrientData = nutritionalData(res.data);
                    setNData(nutrientData);
                })
                .catch(err => console.log(err));
            }
            else {
                console.log(`using local storage`)
                // if it already exists, save to block var and save to state
                const items = JSON.parse(window.localStorage.getItem('item'+id));
                setItem(items);

                // creates and saves to state the ingredients, instructions and resources
                const ingredientList = createIngredientList(items);
                setIngredientList(ingredientList);
                const instructionList = createInstructionList(items);
                setInstructionList(instructionList);
                const resources = getAllLinks(items);
                setResources(resources);
                const nutrientData = nutritionalData(items);
                setNData(nutrientData);
            }

            return;
            
        },[])

    //this is the user for addFav. Not currently used. need to implement
    const user = useSelector(state => state.user.user);
    // console.log(user);

    // addFav not currently implemented
    const addFav = async () => {
        await axios.post(`http://localhost:4000/favorites/${user.user_id}/create`, {
            food_id: id
        })
            .then(res => console.log(res))
            .catch(err => console.error(err));
    }

    // this creates the ingredient list from the recipe item
    const createIngredientList = (item) => {
        // makes sure there is an item and extended ingredinets
        if (item !== null && item.hasOwnProperty('extendedIngredients')) {
            //parse out the ingredients
            const ingredients = [];
            for (const el of item.extendedIngredients) {
                ingredients.push(`${el.amount} ${el.unit} of ${el.name}`);
            }
            //parse into a react component array list
            const ingredientList = [];
            for (let i = 0; i < ingredients.length; i++) {
                ingredientList.push(<li key={i}>{ingredients[i]}</li>)
            }
            return ingredientList;
        }
        return [];
    }

    //parse out the instructions   
    const createInstructionList = (item) => {
        // console.log(item.analyzedInstructions[0].steps);
        // makes sure there is an item and extended instructions
        if (item !== null && item.hasOwnProperty('analyzedInstructions')) {
            //parse out the ingredients
            const instructions = [];
            for (const instruction of item.analyzedInstructions[0].steps) {
                instructions.push(`${instruction.step}`);
            }
            //parse into a list
            const instructionList = [];
            for (let i = 0; i < instructions.length; i++) {
                instructionList.push(<li key={i}>{instructions[i]}</li>)
            }
            return instructionList;
        }
        return [];
    }

    //see if the popular is valid or not
    const popularImg = (item) => {
        console.log(`popular`)
        if (item && item.veryPopular) return (<img src={popularPng} alt={'Very Popular!'} />)
        else return (<></>);
    }

    const nutritionalData = (item) => {
        const output = [];
            if (item !== null) {
                const nutrition = item.nutrition.nutrients;
                
                for (const nutrient of nutrition) {
                    output.push(<><b>{`${nutrient.name}`}</b>{` ${nutrient.amount} ${nutrient.unit} (${nutrient.percentOfDailyNeeds}% DV)   `}</>)
                    output.push()
                }
            }
        return output;
    }

    // creates all the links for resources
    const getAllLinks = (item) => {
        
        console.log('getAllLinks');
        //keys from the recipe object
        const categories = ['cuisines', 'dishTypes', 'diets', 'occasions'];
        const output = [];

        //iterate over categories
        for (const category of categories) {
            // console.log(` category: ${category}`);

            // if not empty categories
            if (item[category].length) {

                //add the category header
                output.push(<b className="topic">{titleCase(category)} : </b> )
                //add category elements
                item[category].map((link) => {
                    console.log(`    topic: ${link}`);
                    output.push(
                        <>
                        <a href={`../search?${category}=${link}`}>{titleCase(link)} </a>
                        </>
                    )}
                )
                //line break
                output.push(<br/>)
            }
        }
        return output;
    }

    //properly capitalize first letter
    function titleCase(str) {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
          str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
        }
        return str.join(' ');
    }

    return (
        <>
            <Nav />
                <div className={style.containerMain}>
                    <div className={style.main}>
                        <div className={style.searchItem}>
                            <div className={style.searchItemHeader}>
                                <div className={style.searchItemHeaderCol1}>
                                    {popularImg}<h1>{item ? item.title : ''}</h1>
                                </div>
                                <div className={style.searchItemHeaderCol2}>
                                    <b>Servings:</b> {item ? item.servings : ''}<br/>
                                    <b>Calories:</b> {item && item.nutrition ? item.nutrition.nutrients[0].amount : ''} kcal<br/>
                                    Ready in {item ? item.readyInMinutes : ''} minutes!
                                </div>
                            </div>
                            <div className={style.SearchItemSplash}>
                                <div className={style.searchItemSplashCol1}>
                                    <img src={item ? item.image : ''} alt={item ? item.name : ''} />
                                </div>
                                <div className={style.searchItemSplashCol2}>
                                    <h3>Summary</h3><hr/>
                                    <p>{parse(item && item.summary ? item.summary : '')}</p><br/><br/>
                                    <h3>Nutritional Data</h3><hr/>
                                    <p><a href={`../nutrition/`}>{nData}</a></p>

                                </div>
                            </div>
                        </div>
                        <div className={style.searchItemDetails}>
                            <div className={style.searchItemDetailsCol1}>
                                <div className={style.cardTop}><h3>Ingredients</h3></div><hr/>
                                <ul>{ingredientList}</ul>
                            </div>
                            <div className={style.searchItemDetailsCol2}>
                                <div className={style.cardTop}><h3>Instructions</h3></div><hr/>
                                <ol>{instructionList}</ol>
                            </div>
                        </div>
                        <div className={style.findMore}>
                            <div className={style.externalLinks}>
                                <div className={style.cardTop}><h3>Look for More...</h3></div><hr/>
                                {item && resources ? resources : ''}
                            </div>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
    )
}

export default SearchItemPage2;
