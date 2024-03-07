// Declare a variable:
const name = 'Gerdo';

// Access your variable inside of a JSX expression:
const greeting = <p>Hello, {name}!</p>;

import React from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);

const theBestString = 'This text was accessed through a javascript variable';

root.render(<h1>{theBestString}</h1>);