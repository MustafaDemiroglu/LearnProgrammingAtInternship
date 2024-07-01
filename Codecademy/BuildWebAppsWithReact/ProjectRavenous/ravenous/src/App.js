import React from 'react';
import './App.css';
import BusinessList from './data/BusinessList';
import SearchBar from './components/SearchBar';
import axios from 'axios';

function App() {
  const searchYelp = async (term, location, sortBy) => {
    console.log(`Searching Yelp with ${term}, ${location}, ${sortBy}`);

    const url = 'http://localhost:5000/api/yelp';  // Your backend server URL
    const params = {
      term: term,
      location: location,
      sort_by: sortBy,
    };

    try {
      const response = await axios.get(url, { params });
      console.log(response.data.businesses);
      // Implement further data processing here
    } catch (error) {
      console.error('Error fetching data from Yelp API:', error);
    }
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
