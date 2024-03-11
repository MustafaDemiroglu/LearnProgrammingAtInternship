function Button(props) {
    return <button>{props.displayText}</button>;
}

function Button({displayText}) {
    return <button>{displayText}</button>;
}

// App.js
import React from 'react';
import Product from './Product'

function App() {
  return <Product name="Apple Watch" price = {399} rating = "4.5/5.0" />;
}

export default App;

// Product.js
import React from 'react';

function Product(props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <h2>{props.price}</h2>
      <h3>{props.rating}</h3>
    </div>       
  );
}

export default Product;

  
