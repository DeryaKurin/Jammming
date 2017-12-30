import React from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.handleNameChange = this.handleNameChange.bind(this);
	}
	handleNameChange(event) {
		this.props.onNameChange(event.target.value);
	}

	render() {
		return (
			  <div className="Playlist">
					<input onChange= {this.handleNameChange} defaultValue={this.props.name} />
          <TrackList
					  tracks= {this.props.tracks}
						onAdd= {this.props.onAdd}
						onRemove= {this.props.onRemove}
						onChange= {this.handleNameChange}
				  />
          <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
        </div>

		);
	}
}

export default Playlist;
