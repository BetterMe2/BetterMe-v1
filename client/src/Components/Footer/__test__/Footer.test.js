import React from 'react';
import { render } from '@testing-library/react';
import ReactDOM from 'react-dom';

import { MemoryRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

//import components that will be tested
import Footer from './../Footer';
// import App from './../../../App';



// Test to see that footer renders without crashing 
xit('renders without crashing', () => {
    const div =document.createElement("div");
    ReactDOM.render(
    <MemoryRouter>
        <Footer></Footer>
        </MemoryRouter>
        ,div)
})

// Test to see that the home link in the footer takes you to the '/' page
// I don't think this test is working because I am only rendering the footer
// attempted to render the app and check, but didn't find the proper expression for the Expect statement
xit("navigates home when you click home in the footer", ()=>{
    const root = document.createElement('div');
    document.body.appendChild(root)
   
    
    render(
        <MemoryRouter>
            <Footer></Footer>
        </MemoryRouter>, 
        // <Provider>
        //     <App></App>
        // </Provider>
          
        root
    );
    act(()=>{
        
        const goToHomeLink = document.getElementById('homeLink');
        console.log(goToHomeLink)
        goToHomeLink.dispatchEvent(new Event("click", {bubbles:true}));
    });
    
    expect(document.body.textContent).toBe(/Home/i)
});