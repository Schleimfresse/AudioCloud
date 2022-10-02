const createPlaylistModal = document.getElementById("create-playlist-modal");
const createPlaylist_item = document.getElementById("createPlaylist-item");
const create_playlist_close = document.getElementById("create-playlist-close");
const create_playlist_inputfields = [...document.getElementsByClassName("createPlaylist-form-input")];
const playlist_form = document.getElementById("playlist-form");

const addCard = (data) => {
	console.log(data);
	const div = document.getElementById("card-template").content.cloneNode(true);
	div.children[0].children[0].href = `/playlist?list=${data.name}`;
	div.children[0].children[1].href = `/playlist?list=${data.name}`;
	div.querySelector("[title]").textContent = data.title;
	document.getElementById("Libary-Playlists").append(div);
};

playlists.forEach((e) => {
	addCard(e);
});

createPlaylist_item.addEventListener("click", () => {
	createPlaylistModal.showModal();
});

const clearinput = () => {
	createPlaylistModal.close();
	create_playlist_inputfields.forEach((inputfield) => {
		inputfield.value = "";
	});
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
