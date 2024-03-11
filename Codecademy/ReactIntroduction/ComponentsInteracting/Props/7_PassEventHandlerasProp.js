// Talker.js
import React from 'react';
import Button from './Button';

function Talker() {
  function talk() {
    let speech = '';
    for (let i = 0; i < 10000; i++) {
      speech += 'blah ';
    }
    alert(speech);
	}
  return <Button talk={talk} />;
}

export default Talker;

// Button.js
import React from 'react';

function Button() {
    return (
      <button>
        Click me!
      </button>
    );
}

export default Button;

