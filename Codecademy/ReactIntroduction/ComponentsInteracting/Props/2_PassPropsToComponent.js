<Greeting name="Jamel" />
<SloganDisplay message="We're great!" />
<Greeting myInfo={["Astronaut", "Narek", "43"]} />
<Greeting name="The Queen Mary" city="Long Beach, California" age={56} haunted={true} />

//App.js
import React from 'react';
import ReactDOM from 'react-dom';

import PropsDisplayer from './PropsDisplayer';

<PropsDisplayer myProp = "Hello"/>
function App() {
  return <PropsDisplayer />;
}

export default App;


//PropsDisplayer.js
import React from 'react';

function PropsDisplayer(props) {
  	const stringProps = JSON.stringify(props);
    return (
      <div>
        <h1>CHECK OUT MY PROPS OBJECT</h1>
        <h2>{stringProps}</h2>
      </div>
    );
}

export default PropsDisplayer;
