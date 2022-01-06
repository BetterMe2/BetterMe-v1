import style from './Navigation.module.scss';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '@mdi/react';
import { mdiFoodApple } from '@mdi/js';
import { useEffect, useState } from 'react';
import Cookie from 'js-cookie';
// import Logout from '../Logout';


//transition is a boolean value passed from HomePage.js
function Navigation ({ transition }) {

    let biscuit;

    if (Cookie.get('user')) biscuit = JSON.parse(Cookie.get('user'));

    const [user, setUser] = useState(biscuit || null)
    const [show, setShow] = useState(false);

    const route = window.location.pathname;
    //grabs the current url






    const transitionNavBar = () => {
        //this function helps assist the conditional rendering of the divs
        //and 'setting' the navbar in a "fixed" position as the user scrolls down
        if (transition && window.scrollY > 250) setShow(true);
        else {
            setShow(false);
        }
    }

    useEffect(() => {

        let mounted = true;
        if (transition && mounted && window.scrollY > 250) setShow(true);

        if (transition) {
            window.addEventListener('scroll', transitionNavBar);
        } else setShow(true);

        return () => {
            mounted = false;
            window.removeEventListener('scroll', transitionNavBar);
        }
    },[show, transition]);

    const handleLogout = () => {
        console.log(document.cookie)
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "ssid=; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        console.log(document.cookie)
        localStorage.clear()
        setUser(null)
        // return navigate("/login")
    }
    console.log(user)

    return (
        <header className={`${style.Navigation} ${show ? style.show : ''}`}>
            <div className={`${show ? style.logo : style.logoTemp}`}>
            <NavLink to='/'>
                <Icon
                    className={style.svg}
                    path={mdiFoodApple}
                    size={2.2}
                    color={'white'}
                    /></ NavLink>
                    <NavLink to='/' className={`${show ? style.button : style.linkTemp}` }>
                    <h2>Better Me</h2></ NavLink>
                    {/* <a href="http://localhost:3000/">Better Me</a> */}
                {/* </ Link> */}
            </div>

            <div className={style.links}>
                {/* isActive is a NavLink react-routes native property */}
                <NavLink to='/' className={({ isActive }) => `${isActive && show ? style.active : isActive && !show  ? style.activeTemp : ''} ${show ? style.link : style.linkTemp}`}>Home</NavLink>
                <NavLink to='/search' className={({ isActive }) => `${isActive && show ? style.active : isActive  && !show  ? style.activeTemp : ''} ${show ? style.link : style.linkTemp}`}>Meals</NavLink>
                <NavLink to='/exercise' className={({ isActive }) => `${isActive && show ? style.active : isActive  && !show  ? style.activeTemp : ''} ${show ? style.link : style.linkTemp}`}>Gym</NavLink>

                { user ?
                    <>
                        <NavLink to='/summary' className={({ isActive }) => `${isActive && show ? style.active : ''} ${show ? style.link : style.linkTemp}`}>Summary</NavLink>
                        <NavLink to='/nutrition' className={({ isActive }) => `${isActive && show ? style.active : ''} ${show ? style.link : style.linkTemp}`}>Nutrition</NavLink>
                        <NavLink to='/mealplan' className={({ isActive }) => `${isActive && show ? style.active : ''} ${show ? style.link : style.linkTemp}`}>Meal Plan</NavLink>
                        <NavLink to='/profile' className={({ isActive }) => `${isActive && show ? style.active : ''} ${show ? style.link : style.linkTemp}`}>Profile</NavLink>
                        <NavLink to='/' onClick={handleLogout} className={`${show ? style.btn : style.btnTemp} ${route === '/' ? style.btnFocus : ''}`}>Log Out</NavLink>
                        {/* <NavLink to='/' onClick={handleClick} className={({ isActive }) => `${isActive && show ? style.btn : style.btnTemp  && !show  ? style.btnFocus : ''} ${show ? style.btn : style.btnTemp}`}>Logout</NavLink> */}


                        {/* <Logout /> */}
                    </>
                :
                    <>
                        <Link to='/login' className={`${show ? style.btn : style.btnTemp} ${route === '/login' ? style.btnFocus : ''}`}>Login</Link>
                        <Link to='/signup' className={`${show ? style.btn : style.btnTemp} ${route === '/signup' ? style.btnFocus : ''}`}>Sign Up</Link>
                    </>
                }
            </div>

        </header>
    )

};

export default Navigation;