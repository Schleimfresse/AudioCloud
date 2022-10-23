const cardTemplate = document.getElementById("card-template");
const main = document.getElementById("wrapper");
const searchfield = document.getElementById("searchquery_input");
const typefield = document.querySelector("[name = 'mode']");
const URLparameter = new URLSearchParams(window.location.search);
searchfield.value = URLparameter.get("query");
typefield.value = URLparameter.get("mode");

function load() {
	if (!(media == "")) {
		main.append(document.getElementById("wrapper-template").content.cloneNode(true));
		const Audio_Content = document.querySelector("#audio-content");
		const Video_Content = document.querySelector("#video-content");
		const Playlist_Content = document.querySelector("#playlist-content");
		media.forEach((e) => {
			const div = document.getElementById("card-template").content.cloneNode(true);
			div.children[0].href = `/player?v=${e.id}`;
			div.querySelector("[thumbnail]").src = `assets/images/${e.thumbnail}`;
			div.querySelector("[artist]").textContent = e.artist;
			div.querySelector("[title]").textContent = e.title;
			if (e.mime != undefined) {
				if (e.mime.mime.includes("audio/")) Audio_Content.children[1].append(div);
				else if (e.mime.mime.includes("video/")) Video_Content.children[1].append(div);
			} else if (e.type == "playlist") Playlist_Content.children[1].append(div);
		});
		if (Audio_Content.children[1].textContent.trim() === "") Audio_Content.remove();
		if (Video_Content.children[1].textContent.trim() === "") Video_Content.remove();
		if (Playlist_Content.children[1].textContent.trim() === "") Playlist_Content.remove();
	} else {
		main.append(document.getElementById("noresults").content.cloneNode(true));
	}
}

const addSearchInputToDb = () => {
	const value = URLparameter.get("query");
	const mode = URLparameter.get("mode");
	const searchquery = { value: value, mode: mode, type: "search" };
	fetch("/search/history", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({data: searchquery, user: user}),
	});
};

addSearchInputToDb();
load();
