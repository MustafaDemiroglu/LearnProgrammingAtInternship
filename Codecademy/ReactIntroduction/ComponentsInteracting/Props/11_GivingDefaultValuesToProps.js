function Example(props) {
    return <h1>{props.text}</h1>
  }
  
  Example.defaultProps = {
    text: 'This is default text',
};

function Example({text='This is default text'}) {
    return <h1>{text}</h1>
}

function Example(props) {
    const {text = 'This is default text'} = props;
    return <h1>{text}</h1>
}

// Button.js
import React from 'react';

function Button(props) {
  
    return (
      <button>{props.text}</button>
    );
}

Button.defaultProps = {
  text: 'Default Text of Big Button'
};

export default Button;

//App.js
import React from 'react';
import Button from './Button.js';

function App() {
  return <Button text=''/>;
}

export default App


  
 
  
