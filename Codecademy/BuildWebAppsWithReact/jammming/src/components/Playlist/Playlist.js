import React, { useState } from 'react';
import Tracklist from '../Tracklist/Tracklist'; // Adjust path as needed
import './Playlist.css'; // Import Playlist component styles

function Playlist({ initialName, initialTracks }) {
  const [playlistName, setPlaylistName] = useState(initialName);
  const [tracks, setTracks] = useState(initialTracks);

  const addTrack = (track) => {
    if (!tracks.some(existingTrack => existingTrack.id === track.id)) {
      // Add the track to the playlist if it's not already there
      setTracks([...tracks, track]);
    }
  };

  const removeTrack = (track) => {
    const updatedTracks = tracks.filter(existingTrack => existingTrack.id !== track.id);
    setTracks(updatedTracks);
  };

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
      <Tracklist tracks={tracks} onRemove={removeTrack} isRemoval={true} />
    </div>
  );
}

export default Playlist;
