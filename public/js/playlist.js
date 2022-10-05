const main = document.getElementById("playlist-tracks");
const cardTemplate = document.getElementById("card-template");

playlist.tracks.forEach((e) => {
	const div = cardTemplate.content.cloneNode(true);
    console.log(e);
    div.children[0].href = `./player?v=${e.id}`;
	div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
	div.querySelector("[artist]").textContent = e.artist;
	div.querySelector("[title]").textContent = e.title;
	div.querySelector("[duration]").textContent = e.duration;
	main.append(div);
});
