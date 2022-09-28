const cardTemplate = document.getElementById("card-template");
const main = document.getElementById("wrapper");
const searchfield = document.getElementById("searchquery_input");
searchfield.value = query;

function load() {
	if (!(media == "")) {
		main.append(document.getElementById("wrapper-template").content.cloneNode(true));
		const Audio_Content = document.querySelector("#audio-content");
		const Video_Content = document.querySelector("#video-content");
		media.forEach((e) => {
			const div = document.getElementById("card-template").content.cloneNode(true);
			div.children[0].setAttribute("onclick", `window.location.href = "./Player/${e.id}"`);
			div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
			div.querySelector("[artist]").textContent = e.artist;
			div.querySelector("[title]").textContent = e.title;
			if (e.mime.mime.includes("audio/")) Audio_Content.children[1].append(div);
			else if (e.mime.mime.includes("video/")) Video_Content.children[1].append(div);
		});
		if (Audio_Content.children[1].textContent.trim() === "") Audio_Content.remove();
		if (Video_Content.children[1].textContent.trim() === "") Video_Content.remove();
	} else {
		main.append(document.getElementById("noresults").content.cloneNode(true));
	}
}
load();
