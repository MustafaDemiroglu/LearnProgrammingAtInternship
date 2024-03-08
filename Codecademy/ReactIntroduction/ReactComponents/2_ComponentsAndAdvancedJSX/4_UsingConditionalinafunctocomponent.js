// TodaysPlan.js
import React from 'react';

function TodaysPlan() {
    let task;
    let apocalypse = false;
    if (!apocalypse) {
      task = 'learn React.js'
    } else {
      task = 'run around'
    }
    return <h1>Today I am going to {task}!</h1>;
}

export default TodaysPlan;

//TonightsPlan.js
import React from 'react';

const fiftyFifty = Math.random() < 0.5;

// New function component starts here:
function TonightsPlan() {
  if(fiftyFifty) {
    return <h1>Tonight I'm going out WOOO</h1>;
  } else {
    return <h1>Tonight I'm going to bed WOOO</h1>;
  }
}

export default TonightsPlan;