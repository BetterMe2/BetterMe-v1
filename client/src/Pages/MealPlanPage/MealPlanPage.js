import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';

function MealPage() {
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);

    useEffect(()=>{
        if(!user) navigate('/signup')
    });

    return (
        <>
            <Nav />
                <div>
                    <h1>Hello Meal PLan </h1>
                </div>
            <Footer />
        </>
    )
}

export default MealPage
