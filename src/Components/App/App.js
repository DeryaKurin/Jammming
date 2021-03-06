import React from 'react';
import './App.css';

import SearchBar  from '../SearchBar/SearchBar';
import SearchResults  from '../SearchResults/SearchResults';
import Playlist  from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
    searchResults: [],
    playlistName: "New Playlist",
    playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (!tracks.includes(track)) {
      tracks.push(track);
      this.setState({playlistTracks:tracks});
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    const removeTrack = tracks.filter(playlistTrack => track.id !== playlistTrack.id);
    this.setState({playlistTracks: removeTrack});
  }

  updatePlaylistName(name) {
    this.setState({name: this.playlistName});
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName('My playlist');
    //console.info(trackUris);
  }

  search(term) {
    Spotify.search(term).then(searchResults => this.setState({
      searchResults: searchResults
    }));
  }

  render() {
  return (
    <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
          <Playlist
          name={this.state.playlistName}
          tracks={this.state.playlistTracks}
          onRemove={this.removeTrack}
          onNameChange={this.updatePlaylistName}
          onSave={this.savePlaylist} />
        </div>
      </div>
    </div>
  );
 }
}

export default App;
