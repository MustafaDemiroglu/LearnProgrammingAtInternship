<ul>
  <li key="li-01">Example1</li>
  <li key="li-02">Example2</li>
  <li key="li-03">Example3</li>
</ul>

// A key is a JSX attribute. The attribute’s name is key. The attribute’s value should be something unique, similar to an id attribute.

import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);
const people = ['Rowe', 'Prevost', 'Gare'];

const peopleList = people.map((person,i) =>
  // expression goes here:
  return <li key={"person_" + i} >{person}</li>);
);

// root.render goes here:
root.render(<ul>{peopleList}</ul>)