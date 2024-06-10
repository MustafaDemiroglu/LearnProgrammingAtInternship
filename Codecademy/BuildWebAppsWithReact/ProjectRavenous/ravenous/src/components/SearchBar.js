import React, {useState} from "react";
import './SearchBar.css';

const sortOptions = {
    'Best Match': 'best_match',
    'Highest Rated': 'rating',
    'Most Reviewed': 'review_count'
}

const SearchBar = ({onSearch}) => {
    const [term, setTerm] = useState ('');
    const [location, setLocation] = useState('');
    const [sortBy, setSortBy] = useState('best_match');

    const handleSortByChange = (sortOption) => {
        setSortBy(sortOption);
    };

    const handleTermChange = (event) => {
        setTerm(event.target.value);
    };

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const handleSearch = (event) => {
        onSearch(term, location, sortBy);
        event.preventDefault();
    };

    const renderSortoptions = () => {
        return Object.keys(sortOptions).map((option) => {
            const value = sortOptions[option];
            return (
                <li
                    key={value}
                    className={sortBy === value ? 'active' : ''}
                    onClick={() => handleSortByChange(value)}
                >
                    {option}
                </li>
            )
        })
    }

    return (
        <div className="SearchBar">
            <div className="SearchBar-sort-options">
                <ul>{renderSortoptions()}</ul>
            </div>
            <div className="SearchBar-fields">
                <input
                    placeholder="Search Business"
                    value={term}
                    onChange={handleTermChange}
                />
                <input
                    placeholder="Where?"
                    value={location}
                    onChange={handleLocationChange}
                />
            </div>
            <div className="SearchBar-submit">
                <button onClick={handleSearch}>Let's Go!</button>
            </div>
        </div>
    );
};

export default SearchBar;