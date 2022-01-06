/*import react library, style module, axios get module */
import React, { useEffect, useRef, useState } from 'react';
import style from './Exercise.module.scss';
import axios from 'axios';

/* import components */
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import ExerciseItem from '../../Components/ExerciseItem/ExerciseItem';
import Select from 'react-select'
// import wallpaper image for exercise page;
import lifeStyle from '../../images/lifecycle.jpg';

/*import styling modules */
import { mdiMagnify } from '@mdi/js';
import Icon from '@mdi/react';


function ExercisePage() {
    //checks if exercises exist in local storage, is so then assign to biscuit
    let biscuit;
    if (localStorage.getItem('exercises')) biscuit = JSON.parse(localStorage.getItem('exercises'));

    //declare new state variable data, function setData and setting initial state to "biscuit or null"
    const [data, setData] = useState(biscuit || null);

    //declare new state variable array for exerciseList and function setExerciseList setting state to an array of body parts for exercises
    const [exerciseList, setExerciseList] = useState(["back","cardio","chest","lower arms","lower legs","neck","shoulders","upper arms","upper legs","waist"]);

    //assign current property in useRef object to null
    const Search = useRef(null);

    //if the search item is not in local storage, send get request  to API and get all exercises from API
    //store response item in local storage object
    //set data state to response item
    useEffect(() => {
        const options = {
            method: 'GET',
            url: 'https://exercisedb.p.rapidapi.com/exercises',
            headers: {
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
                'x-rapidapi-key': '659185169emshb2c68193fe619efp1a3fe1jsndd22216599fa'
            }
        };

        if (!localStorage.getItem('exercises')) {
            axios.request(options)
                .then((res) => {
                    setData(res.data.slice(0, 100));
                    localStorage.setItem('exercises', JSON.stringify(res.data.slice(0, 100)));
                })
                .catch(err => {

                    console.log(err);
                })
        }

    },[]);

    //sent a get request to get exercises from API based on search input
    //update data state to response items
    const newSearch = async () => {

        var options2 = {
            method: 'GET',
            url: `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${Search.current.value}`,
            headers: {
                'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
                'x-rapidapi-key': '659185169emshb2c68193fe619efp1a3fe1jsndd22216599fa'
            }
        };

        axios.request(options2)
            .then(res => {
                localStorage.setItem('exercises', JSON.stringify(res.data.slice(0, 100)));
                setData(res.data.slice(0,100));
            })
            .catch(err => console.log(err));

    };

    console.log(Search.current)
    console.log(data);

    // const actions = [
    //     {label: "back", value: 'back'}
    // ]

    return (
        <>
            <Nav transition={true} />
            <div>
                <div className={style.Hero} style={{backgroundImage: `url(${lifeStyle})`}}>
                    <h1>Find Your Next Gym Routine</h1>
                    <div className={style.Bar}>
                        {/* <Select options = {actions} onChange={newSearch} ref={Search}/> */}
                        <input ref={Search} type="text" placeholder='Enter The Name of muscle you which to target...' />
                        <Icon
                            onClick={newSearch}
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
                        return <ExerciseItem key={idx} id={item.id} name={item.name} bodyPart={item.bodyPart} target={item.target} equipment={item.equipment} image={item.gifUrl} />
                    })}
                </div>
            </div>
            <br />
            <br />
        <Footer />
        </>
    )
}

export default ExercisePage
