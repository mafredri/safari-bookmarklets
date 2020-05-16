/**
 * Spotify to Apple Music
 *
 * Searches Apple Music for the song or album being viewed on Spotify.
 *
 * Author: Mathias Fredriksson
 * Version: 0.0.0
 */
main();

async function main() {
	const [title, artist, type] = [
		'twitter:title',
		'twitter:audio:artist_name',
		'og:type',
	].map((x) => document.querySelector(`meta[property="${x}"]`).content);

	if (type === 'music.song') {
		entity = 'song';
	} else if (type === 'music.album') {
		entity = 'album';
	} else {
		alert(`Unknown type: ${type}`);
	}

	let query = `${title} ${artist}`;
	let results = await search(query);
	if (!results) {
		// Simplify search query by removing anything in parenthesis...
		query = query.replace(/\([^)]+\)/g, '');
		results = await search(query);
	}

	render(results);
}

function search(query) {
	query = encodeURI(query.replace(/\ /g, '+'));
	const url = `https://itunes.apple.com/search?term=${query}&media=music&entity=${entity}`;

	return new Promise((resolve, reject) => {
		// Spotify seems to have broken fetch, so we use good old xhr.
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status !== 200) {
					reject(xhr.status);
					return;
				}

				const data = JSON.parse(xhr.responseText);
				if (!data.resultCount) {
					resolve(null);
				}
				resolve(data.results);
			}
		};
		xhr.open('GET', url, true);
		xhr.send(null);
	});
}

// TODO: Better styling :P...
function render(results) {
	let html = [];
	for (let r of results) {
		html = [
			...html,
			`<p><a href="${r.collectionViewUrl}"><img src="${r.artworkUrl100}">${r.collectionName} - ${r.artistName}</a></p>`,
		];
	}
	document.write(html.join(''));
}
