import React from 'react';
import './Track.css'; // Import Track component styles

function Track({ track }) {
  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      {/* Add your action button or functionality here */}
    </div>
  );
}

export default Track;