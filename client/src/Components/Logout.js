import {
    BrowserRouter as Router,
    useNavigate,
  } from "react-router-dom";
  import React from 'react';

  const Logout = () => {
    const navigate = useNavigate();

     const handleClick = () => {
        fetch('http://localhost:4000/logout',{
          credentials: 'include',
          })
          .then(response => response.json())
          .then(data => console.log(data))
          .then(window.location.href = "http://localhost:3000/")
        //   .then(setTimeout(()=>{navigate('/login')}, 1000));
        }


    return (
      <button className= "btn" type="button" onClick={handleClick}>
        Log Out
      </button>
    );
  };

  export default Logout;