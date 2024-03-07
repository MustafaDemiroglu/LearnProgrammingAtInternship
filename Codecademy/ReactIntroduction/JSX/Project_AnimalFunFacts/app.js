import { animals } from './animals';
import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);

const title = '';

const displayFact = (e) => {
  const animalName = e.target.alt;
  const randomIndex = Math.floor(Math.random() * animals[animalName].facts.length);
  const fact = animals[animalName].facts[randomIndex];
  const factElement = document.getElementById('fact');
  factElement.innerHTML = fact;
};

const images = [];
for (const animal in animals) {
  const image = (
    <img
      key={animal}
      className='animal'
      alt={animal}
      src={animals[animal].image}
      aria-label={animal}
      role='button'
      onClick={displayFact}
    />
  );
  images.push(image);
}

const showBackground = true;

const background = (
  <img
    className='background'
    alt='ocean'
    src='/images/ocean.jpg'
  />
);

const animalFacts = (
  <div>
    {background}
    {/* Inject the array of images into a <div> with className 'animals' */}
    <div className='animals'>
      {images}
    </div>
    <h1>
      {title || 'Click an animal for a fun fact'} {/* Using the OR || operator to set a default value */}
    </h1>
    <p id='fact'></p> {/* Empty <p> element to display the fact */}
  </div>
);

root.render(animalFacts);
