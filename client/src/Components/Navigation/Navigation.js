import style from './Navigation.module.scss';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Icon from '@mdi/react';
import { mdiFoodApple } from '@mdi/js';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Navigation ({ transition }) {

    const user = useSelector(state => state.user.user);
    const route = window.location.pathname;
    
    // const [change, setChange] = useState(0);
    const [show, setShow] = useState(false);

    const transitionNavBar = () => {
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

    const logout = async () => {
        const deleted = await axios.get('http://localhost:4000/users/logout', { withCredentials: 'include' })
            .then((res) => {
                localStorage.clear();
                return res;
            })
            .catch(err => console.log(err));

        if (deleted) window.location.replace('/login')
    }

    return (
        <header className={`${style.Navigation} ${show ? style.show : ''}`}>
            <div className={`${show ? style.logo : style.logoTemp}`}> 
            <NavLink to='/'>
                <Icon 
                    className={style.svg}
                    path={mdiFoodApple}
                    size={2.2}
                    color={`${show ? style.logo : style.logoTemp}`}
                />
            </NavLink>
                    <NavLink to='/'><h2>Better Me</h2></NavLink>
            </div>

            <div className={style.links}>

                <NavLink to='/' className={({ isActive }) => `${isActive && show ? style.active : isActive && !show  ? style.activeTemp : ''} ${show ? style.link : style.linkTemp}`}>Home</NavLink>
                <NavLink to='/search' className={({ isActive }) => `${isActive && show ? style.active : isActive  && !show  ? style.activeTemp : ''} ${show ? style.link : style.linkTemp}`}>Search</NavLink>
                <NavLink to='/exercise' className={({ isActive }) => `${isActive && show ? style.active : isActive  && !show  ? style.activeTemp : ''} ${show ? style.link : style.linkTemp}`}>Gym</NavLink>

                { user ?
                    <>
                        <NavLink to='/summary' className={({ isActive }) => `${isActive && show ? style.active : ''} ${show ? style.link : style.linkTemp}`}>Summary</NavLink>
                        <NavLink to='/nutrition' className={({ isActive }) => `${isActive && show ? style.active : ''} ${show ? style.link : style.linkTemp}`}>Nutrition</NavLink>
                        <NavLink to='/mealplan' className={({ isActive }) => `${isActive && show ? style.active : ''} ${show ? style.link : style.linkTemp}`}>Meal Plan</NavLink>
                        <NavLink to='/profile' className={({ isActive }) => `${isActive && show ? style.active : ''} ${show ? style.link : style.linkTemp}`}>Profile</NavLink>
                        <NavLink to='/' onClick={logout} className={show ? style.link : style.linkTemp}>Logout</NavLink>
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