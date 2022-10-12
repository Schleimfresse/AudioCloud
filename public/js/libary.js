const createPlaylistModal = document.getElementById("create-playlist-modal");
const createPlaylist_thumbnail = document.getElementById("createPlaylist-thumbnail");
const createPlaylist_string = document.getElementById("createPlaylist-string");
const create_playlist_close = document.getElementById("create-playlist-close");
const create_playlist_inputfields = [...document.getElementsByClassName("createPlaylist-form-input")];
const playlist_form = document.getElementById("playlist-form");
const cardTemplate = document.getElementById("card-template");
const recent_songs_box = document.getElementById("recent-songs-box");
const playlist_item = document.getElementById("card-template-playlist");

const addCard = (data) => {
	console.log(data);
	const div = playlist_item.content.cloneNode(true);
	div.children[0].children[0].children[0].href = `/playlist?list=${data.name}`;
	div.children[0].children[1].children[0].href = `/playlist?list=${data.name}`;
	div.querySelector("[title]").textContent = data.title;
	document.getElementById("Libary-Playlists").append(div);
};

const addRecentSong = async () => {
	recent.forEach((e) => {
		const div = cardTemplate.content.cloneNode(true);
		console.log("if:", e);
		if (e.type === "track") {
			div.children[0].setAttribute("data-track", e.id);
		}
		div.children[0].oncontextmenu = function (e) {
			e.preventDefault();
			contextmenu.style.display = "flex";
			contextmenu.style.left = e.pageX + "px";
			contextmenu.style.top = e.pageY + "px";
			console.log(this);
			console.log(e.path);
			console.log(e.composedPath().includes(this));
			if (e.composedPath().includes(this)) {
				contextmenu.setAttribute("current", this.getAttribute("data-track"));
			}
			return false;
		};
		console.log(div);
		div.querySelector("[link]").href = `./player?v=${e.id}`;
		div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
		div.querySelector("[title]").textContent = e.title;
		recent_songs_box.append(div);
	});
};

addRecentSong();

playlists.forEach((e) => {
	addCard(e);
});

createPlaylist_string.addEventListener("click", () => {
	createPlaylistModal.showModal();
});

createPlaylist_thumbnail.addEventListener("click", () => {
	createPlaylistModal.showModal();
});

const clearinput = () => {
	createPlaylistModal.close();
	playlist_form.children[0].style.borderBottom = "2px solid #fff";
};

create_playlist_close.addEventListener("click", clearinput);

createPlaylistModal.addEventListener("click", (e) => {
	switch_modal_visibility(e, createPlaylistModal);
});

playlist_form.onsubmit = (e) => {
	e.preventDefault();
	fetch("playlist/create", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			title: playlist_form.children[0].value,
			description: playlist_form.children[1].value,
		}),
	})
		.then((res) => res.json())
		.then((data) => addCard(data));
	clearinput();
};
