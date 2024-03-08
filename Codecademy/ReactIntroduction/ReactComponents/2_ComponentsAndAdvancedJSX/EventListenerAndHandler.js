function MyComponent(){
    function handleHover() {
      alert('Stop it.  Stop hovering.');
    }
    return <div onHover={handleHover}></div>;
}

import React from 'react';

// example. how to call a Eventlistener 
function SubmitButton() {
  function handleClick() {
    alert('Submission Successful.');
  }
  return <button onClick={handleClick} >Submit</button>;
}

export default SubmitButton;