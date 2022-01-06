//importing React hooks and axios
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//importing scss module for this SignUpPage component and image
import style from './SignUpPage.module.scss';
import yoga from '../../images/yoga.jpg';

//importing Navigation component
import Nav from '../../Components/Navigation/Navigation';


function SignUpPage() {
     //declare new state variable "loading", function setLoading and setting initial state to false
    const [loading, setLoading] = useState(false);

    //assign current property in useRef object the value of null
    const Fullname = useRef(null);
    const Username = useRef(null);
    const Email = useRef(null);
    const Password = useRef(null);


    const submit = async () => {
        //update loading state to true
        setLoading(true);
        //send post request to users/signup
        await axios.post('http://localhost:4000/users/signup', {
                fullname: Fullname.current.value,
                username: Username.current.value,
                email: Email.current.value,
                password: Password.current.value,
        }, { withCredentials: true })
            .then((res) => {
                //if signup successful redirect to userDetails page
                window.location.replace('/userdetails');
            })
            .catch((err) => {
                //if error in signup, update loading state to false
                setLoading(false);
                console.log(err);
            })
    }

    return (
        <>
            <Nav />
            <div style={{backgroundImage: `url(${yoga})`}} className={style.main}>
                { loading ?
                        <div className={style.loader}></div>
                    :
                    <div className={style.container}>
                        <form className={style.content}>
                                <h1>Sign Up</h1>
                                <br /><br />

                                <label htmlFor="nameS">Full Name</label>
                                <br />
                                <input ref={Fullname} id='nameS' type="text" placeholder='Enter Your Name...' />

                                <br /><br />

                                <label htmlFor="username">Username</label>
                                <br />
                                <input ref={Username} id='username' type="text" placeholder='Enter Your Username...must be 6-20 characters' />

                                <br /><br />

                                <label htmlFor="email">Email</label>
                                <br />
                                <input ref={Email} id='email' type="text" placeholder='Enter Your Email...' />

                                <br /><br /><br />

                                <label  htmlFor="passwordS">Password</label>
                                <br />
                                <input ref={Password} id='passwordS' type="password" placeholder='Enter Your Password...must be at least 6 characters' />

                                <br /><br /><br />
                                <button type='button' onClick={(e) => {
                                    e.preventDefault();
                                    submit()
                                    console.log('clicked')
                                }} className={style.btn}>Submit</button>
                        </form>
                    </div>
                }
            </div>
        </>
    )
}

export default SignUpPage
