import React from 'react';
import Track from '../Track/Track'; // Adjust path as needed
import './Tracklist.css'; // Import TrackList component styles

function Tracklist({ tracks, onAdd }) {
  return (
    <div className="Tracklist">
      {
        tracks.map(track => (
          <Track key={track.id} track={track} onAdd={onAdd} />
        ))
      }
    </div>
  );
}

export default Tracklist;