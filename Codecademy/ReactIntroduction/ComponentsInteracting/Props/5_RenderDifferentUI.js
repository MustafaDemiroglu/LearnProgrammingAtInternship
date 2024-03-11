function LoginMsg(props) {
    if (props.password === 'a-tough-password') {
      return <h2>Sign In Successful.</h2>
    } else {
      return <h2>Sign In Failed..</h2>
    }
}


//App.js
import React from 'react';
import Greeting from './Greeting';

function App() {
  return (
    <div>
      <h1>
        MovieFlix
      </h1>
      <Greeting name="Alison" signedIn={true}/>
    </div>
  );
}

export default App;

//Greeting.js
import React from 'react';

function Greeting(props) {
  if (props.signedIn == false) {
    return <h1>Please login.</h1>;
  } else {
    return (
      <>
        <h1>Welcome back, {props.name}!</h1>
        <article>
          Latest Movie: A Computer Bug's Life
        </article>
      </>
    )
  }
}

export default Greeting;