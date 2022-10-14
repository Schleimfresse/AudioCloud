const skel_cardTemplate = document.getElementById("skeleton-card-template");
const cardTemplate = document.getElementById("card-template");
const main = document.getElementById("Media_Showcase_wrapper");
const tracks_wrapper = document.getElementById("tracks");
const playlists_wrapper = document.getElementById("playlists");
const content_wapper = document.getElementById("content-main");
for (let i = 0; i < 30; i++) {
	main.append(skel_cardTemplate.content.cloneNode(true));
}

window.onload = function () {
	async function load() {
		const res = await fetch("/api");
		const data = await res.json();
		main.textContent = "";
		main.append(content_wapper.content.cloneNode(true));
		const tracks_wrapper = document.getElementById("tracks");
		const playlists_wrapper = document.getElementById("playlists");
		data.forEach((e) => {
			const div = cardTemplate.content.cloneNode(true);
			if (e.type === "track") {
				div.children[0].setAttribute("data-track", e.id);
			}
			div.children[0].oncontextmenu = function (e) {
				e.preventDefault();
				contextmenu.style.display = "flex";
				contextmenu.style.left = e.pageX + "px";
				contextmenu.style.top = e.pageY + "px";
				if (e.composedPath().includes(this)) {
					contextmenu.setAttribute("current", this.getAttribute("data-track"));
				}
				return false;
			};
			div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
			console.log(e);
			if (e.type === "playlist") {
				div.querySelector("[link]").href = `./playlist?list=${e.id}`;
				div.children[0].children[1].append(document.createElement("a"));
				div.children[0].children[1].children[0].href = `/playlist?list=${e.id}`;
				div.children[0].children[1].children[0].classList.add("underline_link");
				div.children[0].children[1].children[0].textContent = e.title;
			} else {
				div.querySelector("[link]").href = `./player?v=${e.id}`;
				div.querySelector("[title]").textContent = e.title;
			}
			if (e.type == "track") tracks_wrapper.children[1].append(div);
			else if (e.type == "playlist") playlists_wrapper.children[1].append(div);
		});
		if (tracks_wrapper.children[1].textContent.trim() === "") tracks_wrapper.remove();
		if (playlists_wrapper.children[1].textContent.trim() === "") playlists_wrapper.remove();
		addScrollBtnLogic();
	}
	load();
};
