//importing React hooks and axios
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//importing scss module for this component and image
import style from './UserDetailsPage.module.scss';
import image from '../../images/rezel.jpg';



function UserDetailsPage() {

    const navigate = useNavigate();

    const user = useSelector(state => state.user.user);

    //declare new state variable "loading", function setLoading and setting initial state to false
    const [loading, setLoading] = useState(false);

    //upon render, if user does not exist redirect to signup page
    useEffect(() => {
        if (!user) navigate('/signup');
    })

    //assign current property in useRef object the value of null
    const Age = useRef(null);
    const Height = useRef(null);
    const Weight = useRef(null);
    const Diet = useRef(null);
    const Allergies = useRef(null);
    const Favourite = useRef(null);
    const Hated = useRef(null);

    const createEntry = async () => {
        //update loading state to true
        setLoading(true);
        //send post request to create userDetails
        axios.post(`http://localhost:4000/userDetails/${user.user_id}/create`, {
            user_id: user.user_id,
            height: Height.current.value,
            weight: Weight.current.value,
            age: Age.current.value,
            allergies: Allergies.current.value,
            diet_type: Diet.current.value,
            favoriteFood: Favourite.current.value,
            nonFavoriteFood: Hated.current.value,
        })
        .then(res => {
            //after response is received, redirect to homepage
            window.location.replace('/');
        })
        .catch(err => {
            //if error, update loading state to false
            setLoading(false);
            console.log(err);
        })
    }

    return (
        <div style={{backgroundSize: 'cover', backgroundImage: `url(${image})`}} className={style.main}>
            <div className={style.overlay}>
            { loading ?
                <div className={style.loader}></div>
                :
                <div className={style.container}>
                    <div className={style.content}>
                        <h1>Further User Details</h1>
                        <br /><br />
                        <label htmlFor="age">Age</label>
                        <br />
                        <input ref={Age} type="text" id='age' placeholder='Enter Your Age...'/>

                        <br />
                        <br />

                        <label htmlFor="height">Height</label>
                        <br />
                        <input ref={Height} type="text" id='height' placeholder='Enter Your Age...' />

                        <br />
                        <br />

                        <label  htmlFor="weight">Weight</label>
                        <br />
                        <input ref={Weight} type="text" id='weight' placeholder='Enter Your Height...' />

                        <br />
                        <br />

                        <label htmlFor="diet">Diet</label>
                        <br />
                        <input ref={Diet} type="text" id='diet' placeholder='Enter Your Diet...' />

                        <br />
                        <br />

                        <label htmlFor="allergies">Allergies</label>
                        <br />
                        <input ref={Allergies} type="text" id='allergies' placeholder='Enter Your Allergies...' />

                        <br />
                        <br />

                        <h1>Preferences</h1>
                        <br /><br />
                        <label htmlFor="Favour">Favourite Food</label>
                        <br />
                        <input ref={Favourite} type="text" id='Favour' placeholder='Enter Your Favourite Food...'/>

                        <br />
                        <br />

                        <label htmlFor="Hated">Hated Food</label>
                        <br />
                        <input ref={Hated} type="text" id='Hated' placeholder='Enter Your Most Hated Food...' />

                        <br /><br /><br />

                        <div className={style.btnDiv}>
                            <button onClick={() => window.location.replace('/')} className={style.btnSkip}>Skip</button>
                            <button onClick={createEntry} className={style.btn}>Submit</button>
                        </div>
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

export default UserDetailsPage
