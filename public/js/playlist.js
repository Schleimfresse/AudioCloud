const main = document.getElementById("playlist-tracks");
const cardTemplate = document.getElementById("card-template");
const header_playlist_row = document.getElementById("header-playlist-row");
if (playlist.tracks.length === 1) {
	header_playlist_row.innerText = header_playlist_row.innerText.replace("tracks", "track");
}
playlist.tracks.forEach((e) => {
	const div = cardTemplate.content.cloneNode(true);
	console.log(e);
	div.children[0].href = `./player?v=${e.id}`;
	div.querySelector("[thumbnail]").src = `/assets/images/${e.thumbnail}`;
	div.querySelector("[artist]").textContent = e.artist;
	div.querySelector("[title]").textContent = e.title;
	div.querySelector("[duration]").textContent = e.str_duration;
	main.append(div);
});
