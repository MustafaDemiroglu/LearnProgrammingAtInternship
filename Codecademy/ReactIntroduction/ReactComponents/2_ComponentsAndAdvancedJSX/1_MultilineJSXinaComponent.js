// QuoteMaker.js
import React from 'react';

function QuoteMaker() {
    return (
      <blockquote>
        <p>
          The world is full of objects, more or less interesting; I do not wish to add any more.
        </p>
        <cite>
          <a target="_blank"
            href="https://en.wikipedia.org/wiki/Douglas_Huebler">
            Douglas Huebler
          </a>
        </cite>
      </blockquote>
    );
};

export default QuoteMaker;

// MyQuote.js
import React from 'react';

function MyQuote() {
  return (
      <blockquote>
        <p>
          What is important now is to recover our senses.
        </p>
        <cite>
          <a target="_blank" 
            href="https://en.wikipedia.org/wiki/Susan_Sontag">
            Susan Sontag
          </a>
        </cite>
      </blockquote>
    );  
};

export default MyQuote;

// App.js
import React from 'react';
import MyQuote from './MyQuote'

function App() {
    return (
      <MyQuote />
    );
};

export default App;