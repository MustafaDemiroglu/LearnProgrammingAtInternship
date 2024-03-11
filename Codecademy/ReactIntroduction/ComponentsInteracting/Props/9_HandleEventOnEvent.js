function myClass() {
    function handleHover() {
      alert('I am an event handler.');
      alert('I will be called in response to "hover" events.');
    }
}

function myClass(){
    function handleHover() {
      alert('I am an event handler.');
      alert('I will listen for a "hover" event.');
    }
     return <Child onHover={handleHover} />;
}


// Talker.js
import React from 'react';
import Button from './Button';

function Talker() {
  function handleClick() {
    let speech = '';
    for (let i = 0; i < 10000; i++) {
      speech += 'blah ';
    }
    alert(speech);
	}
  return <Button onClick={handleClick}/>;
}

export default Talker;

// Button.js
import React from 'react';

function Button(props) {
    return (
      <button onClick={props.onClick}>
        Click me!
      </button>
    );
}

export default Button;


