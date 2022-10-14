const main = document.getElementById("playlist-tracks");
const cardTemplate = document.getElementById("card-template");
if(playlist.tracks.length === 1) {
	document.getElementById('header-playlist-row').children[0].textContent = "track"
}
playlist.tracks.forEach((e) => {
	const div = cardTemplate.content.cloneNode(true);
    console.log(e);
    div.children[0].href = `./player?v=${e.id}`;
	div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
	div.querySelector("[artist]").textContent = e.artist;
	div.querySelector("[title]").textContent = e.title;
	div.querySelector("[duration]").textContent = e.str_duration;
	main.append(div);
});
