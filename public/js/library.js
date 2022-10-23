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
	div.children[0].children[0].children[0].href = `/playlist?list=${data.id}`;
	div.children[0].children[1].children[0].href = `/playlist?list=${data.id}`;
	div.querySelector("[title]").textContent = data.title;
	document.getElementById("library-Playlists").append(div);
};

const addRecentSong = async () => {
	if (recent != "") {
		recent_songs_box.textContent = "";
	}
	recent.forEach((e) => {
		const div = cardTemplate.content.cloneNode(true);
		if (e.type === "track") {
			div.children[0].setAttribute("data-track", e.id);
		}
		div.children[0].oncontextmenu = (e) => {
			ContextmenuLogic.apply(e);
		};
		console.log(div);
		div.querySelector("[link]").href = `./player?v=${e.id}`;
		div.querySelector("[thumbnail]").src = `/assets/images/${e.thumbnail}`;
		if (e.type === "playlist") {
			div.querySelector(
				"[title]"
			).innerHTML = `<a class="underline_link" title href="/playlist?list=${e.id}">${e.title}</a>`;
		} else {
			div.querySelector("[title]").textContent = e.title;
		}
		recent_songs_box.append(div);
	});
	addScrollBtnLogic();
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
