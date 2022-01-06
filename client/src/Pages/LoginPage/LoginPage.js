import { useState } from 'react';
import style from './LoginPage.module.scss';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

import Nav from '../../Components/Navigation/Navigation';

import avo from '../../images/avo.jpg';

function LoginPage() {

    const { register, handleSubmit, watch, setError, formState: {errors} } = useForm();

    const [loading, setLoading] = useState(false);

    const login = async () => {

        setLoading(false);
        const username = watch("username");
        const password = watch("password");
        console.log(username);
        console.log(password);

        axios.post(`http://localhost:4000/users/login`, {
            username,
            password
        },{ withCredentials: true })
            .then((res) => {
                // navigate('/');
                // setLoading(false);
                setLoading(true);
                window.location.replace('/');
            })
            .catch((err) => {
                setLoading(false);
                const errors = err.response.data
                if (errors) {
                    setError('invalid', {
                        type: 'server',
                        message: 'Incorrect username or password'
                    })
                }
                console.log(errors);
            })
    }

    return (
        <>
            <Nav />
            <div style={{backgroundImage: `url(${avo})`}} className={style.main}>
                {loading ?
                    <div className={style.loader}></div>
                :
                    <div className={style.container}>
                        <div className={style.content}>
                            <form autoComplete="off" onSubmit={handleSubmit(login)}>
                                <h1>Login</h1>
                                <br /><br />

                                <label>Username or Email</label>
                                <br />
                                <input style={errors.username ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('username', { required: 'Username or email is required' })} id="name" type="text" placeholder='Enter Your Name...' />
                                <ErrorMessage errors={errors} name='username' render={({ message }) => <span>{message}</span>} />

                                <br /><br />

                                <label>Password</label>
                                <br />
                                <input style={errors.password ? {border: '1px solid #d47c7c'} : {border: '1px solid transparent'}} {...register('password', { required: 'Password is required' })} id='password' type="password" placeholder='Enter Your Password...' />
                                <ErrorMessage errors={errors} name='password' render={({ message }) => <span>{message}</span>} />

                                <br /><br />
                                { errors.invalid && errors.invalid.type === 'server' && <span>{errors.invalid.message}</span> }
                                <br />
                                <input {...register('invalid')} type='submit' value="Login" className={style.btn}/>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default LoginPage
