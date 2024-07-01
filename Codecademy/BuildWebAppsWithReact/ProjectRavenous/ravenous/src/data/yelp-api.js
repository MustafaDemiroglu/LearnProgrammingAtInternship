// yelp-api.js

import axios from 'axios';

const apiKey = 'rqmgU5s6hzvsNyGtTrsxtxuKvKhyecvh1Mq1Fd4cNMnmMCtOGIL8a-UZejzERzHSwy5PCaEQkw2gS9yhuDwKSVSoN4eH9TTLFFfQjHJiExQNkAnDY_ip6RVV4EyCZnYx'; // Replace with your actual Yelp API key
const apiUrl = 'https://api.yelp.com/v3/businesses/search';

const search = async (term, location, sortBy) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      params: {
        term,
        location,
        sort_by: sortBy,
      },
    });

    return response.data.businesses;
  } catch (error) {
    console.error('Error fetching data from Yelp API', error);
    return [];
  }
};

export { search };
