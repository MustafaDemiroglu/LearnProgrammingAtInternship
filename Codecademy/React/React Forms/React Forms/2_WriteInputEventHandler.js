// Example.js
import React, { useState } from "react";

function Example() {
  const [userInput, setUserInput] = useState("");
  function handleChange(e) {
    setUserInput(e.target.value);
  }
  return <input onChange={handleChange} type="text" />;
}


// Input.js
import React, { useState } from 'react';
import styles from './Input.module.css';

function Input() {
  const [userInput, setUserInput] = useState('');
  function handleUserInput(e) {
    setUserInput(e.target.value);
  } 

  return (
    <>
      <div className={styles.emailContainer}>
        <h2>Let's stay in touch.</h2>
        <p>Sign up for our newsletter to stay up-to-date on the latest products, receive exclusive discounts, and connect with other programmers who share your passion for all things tech.</p>
        <form>
          <label for="email">Email: </label>
          <input id="email" type="text" onChange={handleUserInput}/>
        </form>
      </div>
      <div className={styles.inputDisplay}>
        <h2>Current User Input: </h2>
        <h4></h4>
      </div>
    </>
    );
}

export default Input