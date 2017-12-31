const clientId= 'a252e10fe2064e6eb398ac9a7652c337';
const redirectUri = 'http://localhost:3000/';
const spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

let accessToken;
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
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('AccessToken', null, '/');
		} else {
			window.location = spotifyUrl;
		}
	},

	search(term) {
		const accessToken = Spotify.getAccessToken();
		console.log(term);
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{ headers: {
			Authorization: `Bearer ${accessToken}`}
		}).then(response => {
			console.log(response.json());
			return response.json();
		}).then(jsonResponse => {
			if(!jsonResponse.tracks) {
				return [];
			}
			return jsonResponse.tracks.items.map(track => ({
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
        method: "POST",
				headers: headers,
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
