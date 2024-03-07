const strings = ['Home', 'Shop', 'About Me'];

const listItems = strings.map(string => <li>{string}</li>);

<ul>{listItems}</ul>

// This is fine in JSX, not in an explicit array:
<ul>
  <li>item 1</li>
  <li>item 2</li>
  <li>item 3</li>
</ul>

// This is also fine!
const liArray = [
  <li>item 1</li>, 
  <li>item 2</li>, 
  <li>item 3</li>
];

<ul>{liArray}</ul>


import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);
const people = ['Rowe', 'Prevost', 'Gare'];

const peopleList = people.map((person,i) =>
  // expression goes here:
  return <li>{person}</li>);
);

// root.render goes here:
root.render(<ul>{peopleList}</ul>)