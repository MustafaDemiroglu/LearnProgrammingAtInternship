// This will allow us to use MyComponent in index.js
// App.js
import React from 'react';
function MyComponent() {
    return <h1>Hello World</h1>
}

export default MyComponent;

// index.js
import React from 'react';
import ReactDOM  from 'react-dom/client';
import MyComponent from './4_CreateFunctionComponent';

