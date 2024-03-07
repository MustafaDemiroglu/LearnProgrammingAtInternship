// Here’s a rule that you need to know: you can not inject an if statement into a JSX expression.
// This code will break:

(
    <h1>
      {
        if (purchase.complete) {
          'Thank you for placing an order!'
        }
      }
    </h1>
)

// One option is to write an if statement and not inject it into JSX.

import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);
function coinToss() {
  // This function will randomly return either 'heads' or 'tails'.
  return Math.random() < 0.5 ? 'heads' : 'tails';
}

const pics = {
  kitty: 'https://content.codecademy.com/courses/React/react_photo-kitty.jpg',
  doggy: 'https://content.codecademy.com/courses/React/react_photo-puppy.jpeg'
};
let img;

// if/else statement begins here:
if(coinToss() === 'heads') {
  img = <img src = {pics.kitty}/>
} else {
  img = <img src ={pics.doggy}/>
}

root.render(img);

  