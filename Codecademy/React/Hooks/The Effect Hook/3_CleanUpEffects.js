useEffect(()=>{
    document.addEventListener('keydown', handleKeyPress);
    // Specify how to clean up after the effect:
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
})



// Counter.js
import React, { useEffect, useState } from 'react';

export default function Counter() {
  const [clickCount, setClickCount] = useState(0);
  
  // your code here
  const increment = () =>
  setClickCount((prev) => prev+1); 
  useEffect(() => { 
    document.addEventListener('mousedown', increment);
    return() => {
      document.removeEventListener('mousedown', increment);
    };
  })

  return (
      <h1>Document Clicks: {clickCount}</h1>
  );
}

