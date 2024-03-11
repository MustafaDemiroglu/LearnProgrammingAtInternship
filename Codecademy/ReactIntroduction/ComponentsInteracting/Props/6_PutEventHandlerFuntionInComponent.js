// Example.js
import React from 'react';
import Talker from 'Talker';

function Example() {
  function handleEvent() {
    alert(`I am an event handler.
      If you see this message,
      then I have been called.`);
  }
  return (
      <h1 onClick={handleEvent}>
        Hello world
      </h1>
    );
}

export default Example;

// Talker.js
import React from 'react';
import Button from './Button';
import Example from './Example';

function Talker() {
  function talk() {
  let speech = '';
  for (let i = 0; i < 10000; i++) {
    speech += 'blah ';
  }
  alert(speech);
  }
  return <Button />;
}

export default Talker;