<h1 class="big">Title</h1>
// In JSX, you can’t use the word class! You have to use className instead:
// This is because JSX gets translated into JavaScript, and class is a reserved word in JavaScript.
<h1 className="big">Title</h1>

import React from 'react';
import { createRoot } from 'react-dom/client'

const container = document.getElementById('app');
const root = createRoot(container);
// Write code here:
const myDiv = <div className = "big">I AM A BIG DIV</div>;
root.render(myDiv);