import React from 'react';
import './Track.css'; // Import Track component styles

function Track({ track, onAdd, onRemove, isRemoval }) {

  const handleAddTrack = () => {
    onAdd(track); // Pass the track object to the parent component's addTrack method
  };

  const handleRemoveTrack = () => {
    onRemove(track); // Pass the track object to the parent component's removeTrack method
  };

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      {isRemoval ? (
        <button className="Track-action" onClick={handleRemoveTrack}>-</button>
      ) : (
        <button className="Track-action" onClick={handleAddTrack}>+</button>
      )}
    </div>
  );
}

export default Track;
