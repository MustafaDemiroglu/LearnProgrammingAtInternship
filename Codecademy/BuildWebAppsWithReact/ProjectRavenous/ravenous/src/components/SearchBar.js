import React, { useState, useCallback } from "react";
import styles from "./SearchBar.css";

const sortByOptions = {
  "Best Match": "best_match",
  "Highest Rated": "rating",
  "Most Reviewed": "review_count",
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSortBy, setSelectedSortBy] = useState("best_match");

  const handleSortByChange = useCallback((sortByOptionValue) => {
    setSelectedSortBy(sortByOptionValue);
  }, []);

  const handleSearchTermChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleLocationChange = useCallback((event) => {
    setLocation(event.target.value);
  }, []);

  const handleSearch = useCallback((event) => {
    event.preventDefault();
    console.log(`Searching Yelp with ${searchTerm}, ${location}, ${selectedSortBy}`);
  }, [searchTerm, location, selectedSortBy]);

  const renderSortByOptions = () => {
    return Object.keys(sortByOptions).map((sortByOption) => {
      let sortByOptionValue = sortByOptions[sortByOption];
      return (
        <li
          key={sortByOptionValue}
          className={selectedSortBy === sortByOptionValue ? styles.active : ""}
          onClick={() => handleSortByChange(sortByOptionValue)}
        >
          {sortByOption}
        </li>
      );
    });
  };

  return (
    <div className={styles.SearchBar}>
      <div className={styles.SearchBarSortOptions}>
        <ul>{renderSortByOptions()}</ul>
      </div>
      <div className={styles.SearchBarFields}>
        <input
          placeholder="Search Businesses"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <input
          placeholder="Where?"
          value={location}
          onChange={handleLocationChange}
        />
      </div>
      <div className={styles.SearchBarSubmit}>
        <button onClick={handleSearch}>Let's Go</button>
      </div>
    </div>
  );
};

export default SearchBar;
