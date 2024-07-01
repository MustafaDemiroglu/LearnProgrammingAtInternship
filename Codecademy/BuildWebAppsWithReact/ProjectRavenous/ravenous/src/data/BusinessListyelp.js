import React, { useEffect } from 'react';
import { search } from './yelp-api'; // Adjust the path as needed

function BusinessList({ term, location, sortBy }) {
  useEffect(() => {
    const fetchData = async () => {
      const businesses = await search(term, location, sortBy);
      console.log(businesses); // Log or process the retrieved businesses
    };

    fetchData();
  }, [term, location, sortBy]);

  return (
    <div>
      {/* Your component rendering logic */}
    </div>
  );
}

export default BusinessList;
