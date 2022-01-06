import { useRef, useState } from 'react';
import style from './SignUpPage.module.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import Nav from '../../Components/Navigation/Navigation';

import yoga from '../../images/yoga.jpg';

function SignUpPage() {

    const { register, handleSubmit, watch, formState: {errors} } = useForm();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const submit = async () => {

        setLoading(false);
        const FullName = watch("fullName");
        const Username = watch("username");
        const Email = watch("email");
        const Password = watch("password");
        console.log(FullName);
        console.log(Username);
        console.log(Email);
        console.log(Password);

        await axios.post('http://localhost:4000/users/signup', {
                fullName: FullName,
                username: Username,
                email: Email,
                password: Password
        }, { withCredentials: true })
            .then((res) => {
                console.log(res);
                // navigate('/userdetails');
                // setLoading(false);
                setLoading(true);
                window.location.replace('/userdetails');
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                console.log(err.response.data);
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
                        <form autoComplete="off" onSubmit={handleSubmit(submit)} className={style.content}> 
                                <h1>Sign Up</h1>
                                <br />

                                <label>Full Name</label>
                                <br />
                                <input style={errors.fullName ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('fullName', { required: "Full name is required" })} id='nameS' type="text" placeholder='Enter your full name' />
                                <ErrorMessage errors={errors} name='fullName' render={({ message }) => <span>{message}</span>} />

                                <br />
                                <br />

                                <label>Username</label>
                                <br />
                                <input style={errors.username ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('username', { required: true, minLength: 6, maxLength: 20 })} id='username' type="text" placeholder='Enter your username' />
                                { errors.username && errors.username.type === 'required' && <span>Username is required</span> }
                                { errors.username && errors.username.type === 'minLength' && <span>Username should be at least 6 characters</span> }
                                { errors.username && errors.username.type === 'maxLength' && <span>Username should be at most 20 characters</span> }

                                <br />
                                <br />

                                <label>Email</label>
                                <br />
                                <input style={errors.email ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('email', { required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} id='email' type="text" placeholder='Enter your email' />
                                { errors.email && errors.email.type === 'required' && <span>Email is required</span> }
                                { errors.email && errors.email.type === 'pattern' && <span>Please enter a valid email address</span> }

                                <br />
                                <br />
                                
                                <label>Password</label>
                                <br />
                                <input style={errors.password ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('password', { required: true, minLength: 6 })} id='passwordS' type="password" placeholder='Enter your password' />
                                { errors.password && errors.password.type === 'required' && <span>Password is required</span> }
                                { errors.password && errors.password.type === 'minLength' && <span>Password should be at least 6 characters</span> }

                                <br />
                                <br />

                                <input type='submit' value="Sign up" className={style.btn}/>
                        </form>
                    </div>
                }
            </div>
        </>
    )
}

export default SignUpPage
