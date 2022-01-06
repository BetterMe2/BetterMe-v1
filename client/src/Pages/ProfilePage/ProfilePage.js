//importing React library and hooks
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//importing scss module for this ProfilePage component
import style from './ProfilePage.module.scss';

//importing components and  image
import Nav from '../../Components/Navigation/Navigation';
import Footer from '../../Components/Footer/Footer';
import placeholder from '../../images/placeHolder.png';
import Account from './Components/AccountComponent/Account';
import General from './Components/GeneralComponent/General';


function ProfilePage() {
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);

    //declare new state variable "active", function setActive and setting initial state to "General"
    const [active, setActive] = useState('General');

    //upon render, navigate to signup page if user is not signed up
    useEffect(()=> {
        if (!user) navigate('/signup');
    });

    return (
        <>
            <Nav />
                <div className={style.main}>
                    <div className={style.sideBar}>
                        <h1>Account Page</h1>
                        <img className={style.image} src={placeholder} alt="" />

                        <h2>{ user ? user.fullname : ''}</h2>
                        <div className={style.actions}>

                            <div className={`${active === 'General' ? style.active : ''}`} onClick={() => setActive('General')}>
                                <p>General</p>
                            </div>

                            <div className={`${active === 'Settings' ? style.active : ''}`} onClick={() => setActive('Settings')}>
                                <p>Settings</p>
                            </div>

                            <div className={`${active === 'Account' ? style.active : ''}`} onClick={() => setActive('Account')}>
                                <p>Account</p>
                            </div>

                            <div className={`${active === 'Help' ? style.active : ''}`} onClick={() => setActive('Help')}>
                                <p>Help</p>
                            </div>

                            <div className={`${active === 'Privacy' ? style.active : ''}`} onClick={() => setActive('Privacy')}>
                                <p>Privacy & Safety</p>
                            </div>

                        </div>
                    </div>
                    <div className={style.container}>
                        { active === 'General' ?
                            <General />
                        : active === 'Settings' ?
                            <h1>Setting Components</h1>
                        : active === 'Account' ?
                            <Account />
                        : active === 'Help' ?
                            <h1>Help Component</h1>
                        : active === 'Privacy' ?
                            <h1>Privacy & Safety</h1>
                        : ''}
                    </div>
                </div>
            <Footer />
        </>
    )
}

export default ProfilePage;
