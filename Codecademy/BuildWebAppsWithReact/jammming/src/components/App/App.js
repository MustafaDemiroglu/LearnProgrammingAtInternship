import React, { useState } from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist'; // Adjust path as needed

function App() {
  // Mock initial playlist data
  const initialPlaylist = {
    name: 'My Awesome Playlist',
    tracks: [
      { id: '1', name: 'Song 1', artist: 'Artist 1', album: 'Album 1' },
      { id: '2', name: 'Song 2', artist: 'Artist 2', album: 'Album 2' },
      { id: '3', name: 'Song 3', artist: 'Artist 3', album: 'Album 3' },
    ]
  };

  const [playlist, setPlaylist] = useState(initialPlaylist);

  return (
    <div className="App">
      <h1>My Jammming App</h1>
      <Playlist initialName={playlist.name} initialTracks={playlist.tracks} />
    </div>
  );
}

export default App;
