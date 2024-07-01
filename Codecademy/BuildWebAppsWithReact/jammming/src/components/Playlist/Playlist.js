import React, { useState } from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css'; // Import Playlist component styles

function Playlist({ initialName, initialTracks }) {
  const [playlistName, setPlaylistName] = useState(initialName);
  const [tracks, setTracks] = useState(initialTracks);

  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  return (
    <div className="Playlist">
      <input
        value={playlistName}
        onChange={handleNameChange}
        placeholder="Enter playlist name"
      />
      <TrackList tracks={tracks} />
    </div>
  );
}

export default Playlist;

