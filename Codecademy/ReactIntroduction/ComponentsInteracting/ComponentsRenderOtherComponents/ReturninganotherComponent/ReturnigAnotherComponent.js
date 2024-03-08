function PurchaseButton() {
    return <button onClick={()=>{alert("Purchase Complete")}}>Purchase</button>
  }
  
  function ItemBox() {
    return (
      <div>
        <h1>50% Sale</h1>
        <h2>Item: Small Shirt</h2>
        <PurchaseButton />
      </div>
    );
}

import React from 'react';

function Picture() {
  return <img src="https://content.codecademy.com/courses/React/react_photo-octopus.jpg" />;
}

function Profile() {
  return (
    <>
      <Picture />
      <h1>Name: Octavia</h1>
      <h2>Species: Octopus</h2>
       <h2>Class: Cephalopoda</h2>
    </>
  )
}

export default Profile;