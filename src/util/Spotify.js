const clientId= '21cf8db0c9dd4f56b6aa71398d190e3c';
const redirectUri = 'http://localhost:3000/';
const spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

let accessToken = undefined;
let expiresIn = undefined;

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}
	  const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
		const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
		if (urlAccessToken && urlExpiresIn) {
			accessToken = urlAccessToken[1];
			expiresIn = urlExpiresIn[1];
			window.setTimeOut(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('AccessToken', null, '/');
		} else {
			window.location = spotifyUrl;
		}
	},

	search(term) {
		fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{ headers: {
			Authorization: `Bearer ${accessToken}`}
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			if(!jsonResponse.tracks) {
				return [];
			}
			return jsonResponse.tracks.map(track => ({
				id: track.id,
				name: track.name,
				artist: track.artists[0].name,
				album: track.album.name,
				uri: track.uri
			}));
		});
	},

	savePlaylist(name, trackUris) {
		if (!name || !trackUris) return;
		const userUrl = 'https://api.spotify.com/v1/me';
		const headers = {
			Authorization: `Bearer ${accessToken}`};
		let userId;
		let playlistId;
		fetch(userUrl, {
			headers: headers
		}).then(response => response.json()).then(jsonResponse => userId = jsonResponse.id).then(() => {
			const createPlaylistUrl = `https://api.spotify.com/v1/users/{user_id}/playlists`;
			fetch(createPlaylistUrl, {
				headers: headers,
				method: "POST",
				body: JSON.stringify({
					name: name
				})
			}).then(response => response.json()).then(jsonResponse => playlistId = jsonResponse.id).then(() => {
				const addPlaylistTrackUrl = `https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks`;
				fetch(addPlaylistTrackUrl, {
					headers: headers,
					method: "POST",
					body: JSON.stringify({
						uris: trackUris
					})
				});
			})
		})
	}
};

export default Spotify;
