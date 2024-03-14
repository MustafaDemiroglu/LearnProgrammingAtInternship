// inline styles
<h1 style ={{color:'red'}}>Hello World</h1>

// style Object
const darkMode = {
    color: 'white',
    background: 'black'
};
<h1 style={darkMode}>Hello World</h1>

// App.js
import React from 'react';
import StyleDemo from './StyleDemo'

function App() {
  return <StyleDemo />;
}

export default App


// StyleDemo.js
import React from 'react';

const myStyle = {
  background: 'lightblue',
  color : 'darkblue'
}

function StyleDemo() {
  return (
    <>
      <h1 style = {{ background: 'lightgreen', color: 'darkgreen' }} >Style This With Inline Styling</h1>
      <h1 style = {myStyle}>Style This With Style Object Variable</h1>
    </>
  );
}

export default StyleDemo