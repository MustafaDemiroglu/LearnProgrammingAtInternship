const headline = (
    <h1>
      { age >= drinkingAge ? 'Buy Drink' : 'Do Teen Stuff' }
    </h1>
);


import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);
function coinToss () {
  // Randomly return either 'heads' or 'tails'.
  return Math.random() < 0.5 ? 'heads' : 'tails';
}

const pics = {
  kitty: 'https://content.codecademy.com/courses/React/react_photo-kitty.jpg',
  doggy: 'https://content.codecademy.com/courses/React/react_photo-puppy.jpeg'
};

const img = <img src={pics[coinToss()==='heads' ? 'kitty' : 'doggy']} />;

root.render(img);