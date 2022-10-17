const main = document.getElementById("search-history-list");
const content_wapper = document.getElementById("content-main");
const cardTemplate = document.getElementById("card-template");

async function load() {
	const res = await fetch("/api/history");
	const data = await res.json();
	data.sort(function (a, b) {
		return b.date - a.date;
	});
	console.log(data);
	data.forEach((e) => {
		const div = cardTemplate.content.cloneNode(true);
		console.log(e);
		div.children[0].setAttribute("data-track", e.id);
		div.children[0].oncontextmenu = (e) => {
			ContextmenuLogic.apply(e);
		};
		div.children[0].href = `./player?v=${e.id}`;
		div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
		div.querySelector("[artist]").textContent = e.artist;
		div.querySelector("[title]").textContent = e.title;
		div.querySelector("[duration]").textContent = e.str_duration;
		main.append(div);
	});
}
load();
