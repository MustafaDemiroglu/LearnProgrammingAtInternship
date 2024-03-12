import React, { useState, useEffect } from 'react';
 
function PageTitle() {
  const [name, setName] = useState('');
 
  useEffect(() => {
    document.title = `Hi, ${name}`;
  });
 
  return (
    <div>
      <p>Use the input field below to rename this page!</p>
      <input onChange={({target}) => setName(target.value)} value={name} type='text' />
    </div>
  );
}


// Counter.js
import React, { useEffect, useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => { alert(`Count: ${count}`)});
  const handleClick = () => {
    setCount((prevCount) =>  prevCount + 1);
  };

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={handleClick}>
        Click me
      </button>
    </div>
  );
}