const styles = {
    marginTop: '20px',
    backgroundColor: 'green'
};
const styles2 = {fontSite:30};
const styles3 = {"2 em"};

//StyleDemo.js
import React from 'react';
const myStyle = {
  background: 'lightblue',
  color: 'darkblue',
  marginTop : 100,
  fontSize: 50
}

function StyleDemo() {
  return <button style={myStyle}>button</button>
}

export default StyleDemo