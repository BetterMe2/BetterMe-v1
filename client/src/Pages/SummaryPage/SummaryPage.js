//importing React hooks and axios
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//importing Navigation and Footer components
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';

function SummaryPage() {

    const navigate = useNavigate();

    const user = useSelector(state => state.user.user)

    //declare new state variable "data, function setData and setting initial state to null
    const [data, setData] = useState(null);

    useEffect(()=> {
        //if user does not exist, redirect to signup page
        if(!user) navigate('/signup');
        //if user exists, send get request to favorites page for the user
        if (user) {
            axios.get(`http://localhost:4000/favorites/${user.user_id}`)
                .then(res => setData(res.data))
        }
    }, [navigate, user]);

    console.log(data)

    return (
        <>
            <Nav />
                <div>

                </div>
            <Footer />
        </>
    )
}

export default SummaryPage;