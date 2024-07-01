import React, { useState } from 'react';
import './App.css';
import Tracklist from '../components/Tracklist/Tracklist';
import Playlist from '../components/Playlist/Playlist';

function App() {
  const initialPlaylist = {
    name: 'My Awesome Playlist',
    tracks: []
  };

  const [playlist, setPlaylist] = useState(initialPlaylist);

  const addTrack = (track) => {
    if (!playlist.tracks.some(existingTrack => existingTrack.id === track.id)) {
      setPlaylist({
        ...playlist,
        tracks: [...playlist.tracks, track]
      });
    }
  };

  const removeTrack = (track) => {
    const updatedTracks = playlist.tracks.filter(existingTrack => existingTrack.id !== track.id);
    setPlaylist({
      ...playlist,
      tracks: updatedTracks
    });
  };

  // Define mock searchResults array
  const searchResults = [
    { id: '1', name: 'Song 1', artist: 'Artist 1', album: 'Album 1' },
    { id: '2', name: 'Song 2', artist: 'Artist 2', album: 'Album 2' },
    { id: '3', name: 'Song 3', artist: 'Artist 3', album: 'Album 3' },
  ];

  return (
    <div className="App">
      <h1>My Jammming App</h1>
      <Tracklist tracks={searchResults} onAdd={addTrack} />
      <Playlist initialName={playlist.name} initialTracks={playlist.tracks} onRemove={removeTrack} />
    </div>
  );
}

export default App;
