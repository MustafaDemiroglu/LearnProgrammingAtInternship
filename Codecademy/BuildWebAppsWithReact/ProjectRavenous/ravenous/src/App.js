import React from 'react';
import './App.css';
import BusinessList from './data/BusinessList';
import SearchBar from './components/SearchBar';


function App() {
  const searchYelp = (term, location, sortBy) => {
    console.log(`Searching Yelp with ${term}, ${location}, ${sortBy}`);
    // Implementieren Sie hier den Yelp API Aufruf
  };

  return (
    <div className="App">
      <h1>Ravenous</h1>
        <SearchBar onSearch={searchYelp} />
        <BusinessList />
    </div>
  );
}

export default App;
