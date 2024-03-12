useEffect(() => {
    alert("component rendered for the first time");
    return () => {
      alert("component is being removed from the DOM");
    };
}, []); 


// Timer.js
import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [time, setTime] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleChange = ({ target }) => setName(target.value);

  return (
    <>
      <input value={name} onChange={handleChange} type='text' />
      <h1>Time: {time}</h1> 
    </>
  );
}