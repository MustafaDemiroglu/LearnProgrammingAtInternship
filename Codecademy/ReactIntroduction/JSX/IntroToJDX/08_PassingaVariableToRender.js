const toDoList = (
    <ol>
      <li>Learn React</li>
      <li>Become a Developer</li>
    </ol>
  );
  
  const container = document.getElementById('app');
  const root = createRoot(container);
  root.render(toDoList);


  import React from 'react';
  import { createRoot } from 'react-dom/client';
  
  const container2 = document.getElementById('app');
  const root2 = createRoot(container);
  // Write code here:
  const myList = 
  (
    <ul>
      <li>What kind of text is that</li>
      <li>What kind of text is that</li>
      <li>What kind of text is that</li>
      <li>What kind of text is that</li>
      <li>What kind of text is that</li>
    </ul>
  );
  
  root2.render(myList);