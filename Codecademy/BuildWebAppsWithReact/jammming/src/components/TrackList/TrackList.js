import React from 'react';
import Track from '../Track/Track'; // Adjust path as needed
import './TrackList.css'; // Import TrackList component styles

function TrackList({ tracks }) {
  return (
    <div className="TrackList">
      {
        tracks.map(track => <Track key={track.id} track={track} />)
      }
    </div>
  );
}

export default TrackList;
