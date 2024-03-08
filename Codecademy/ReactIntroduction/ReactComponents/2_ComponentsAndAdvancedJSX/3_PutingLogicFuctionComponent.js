function RandomNumber() {
    //First, some logic that must happen before returning
    const n = Math.floor(Math.random() * 10 + 1);
    //Next, a return statement using that logic: 
    return <h1>{n}</h1>
}

// Here’s an example of some calculations that can be done inside a function component

import React from 'react';

const friends = [
  {
    title: "Yummmmmmm",
    src: "https://content.codecademy.com/courses/React/react_photo-monkeyweirdo.jpg"
  },
  {
    title: "Hey Guys! Wait Up!",
    src: "https://content.codecademy.com/courses/React/react_photo-earnestfrog.jpg"
  },
  {
    title: "Yikes",
    src: "https://content.codecademy.com/courses/React/react_photo-alpaca.jpg"
  }
];

// New function component starts here:
function Friend() {
  const n = Math.floor(Math.random()*3);
  var friend = friends[n];

  return (
    <div>
      <h1>{friend.title}</h1>
      <img src={friend.src} />
    </div>
  );
}

export default Friend;