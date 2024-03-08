// App.js 
import React from 'react';

function MyComponent() {
  return <h1>Hello world</h1>;
}

export default MyComponent;

//index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

import MyComponent from './App';

ReactDOM.createRoot(document.getElementById('app')).render(<MyComponent/>);

// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
</head>
<body>
  <main id="app">
  </main>
	<script src="https://content.codecademy.com/courses/React/react-18-course-bundle.min.js"></script>
  <script src="/index.compiled.js"></script>
</body>
</html>
