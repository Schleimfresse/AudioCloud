const contextmenu = document.getElementById("contextmenu");
const addToPlaylistDOM = document.getElementById("addToPlaylist");
const notification_box = document.getElementById("notification-banner");
const playlist_item_wrapper = document.getElementById("addToPlaylist-playlist-wrapper");
const close_addToPlaylist_modal = document.getElementById("addToPlaylist-playlist-wrapper-close");
let controller = 0;

const onContextmenu = (e) => {
	const rect = contextmenu.getBoundingClientRect();
	let isInContextmenu =
		rect.top <= e.clientY &&
		e.clientY <= rect.top + rect.height &&
		rect.left <= e.clientX &&
		e.clientX <= rect.left + rect.width;
	if (!isInContextmenu) {
		contextmenu.style.display = "none";
	}
};

const displayNotification = (data) => {
	contextmenu.style.display = "none";
	notification_box.setAttribute("data-visibility", "");
	notification_box.textContent = data.message;
	setTimeout(() => {
		notification_box.removeAttribute("data-visibility", "");
	}, 3000);
};

const addToPlaylist = (playlist_id) => {
	const body = JSON.stringify({
		id: addToPlaylistDOM.parentElement.getAttribute("current"),
		playlist: playlist_id,
	});
	playlist_item_wrapper.close();
	fetch("/playlist/add", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	})
		.then((res) => res.json())
		.then((data) => displayNotification(data));
};

const createPlaylistItems = (data) => {
	data.forEach((e) => {
		div = document.createElement("div");
		div.textContent = e.title;
		div.classList.add("addToPlaylist-item");
		div.onclick = function () {
			addToPlaylist(e.id);
		};
		playlist_item_wrapper.children[1].append(div);
	});
};

addToPlaylistDOM.addEventListener("click", (e) => {
	if (controller === 0) {
		fetch("/api/playlists")
			.then((res) => res.json())
			.then((data) => createPlaylistItems(data));
		controller = 1;
	}
	playlist_item_wrapper.showModal();
});
playlist_item_wrapper.addEventListener("click", (e) => switch_modal_visibility(e, playlist_item_wrapper));
window.addEventListener("click", onContextmenu);
close_addToPlaylist_modal.addEventListener("click", () => playlist_item_wrapper.close());

const addScrollBtnLogic = () => {
	const tracks_previous_btn = document.getElementById("row-previous");
	const tracks_next_btn = document.getElementById("row-next");
	const tracks = tracks_previous_btn.parentElement.parentElement.parentElement.children[1];
	console.log(tracks);
	tracks_next_btn.onclick = function () {
		tracks.scrollBy({
			left: tracks.offsetWidth,
			behavior: "smooth",
		});
		setTimeout(() => {
			if (tracks.scrollLeft !== 0) {
				tracks_previous_btn.removeAttribute("disabled");
			}
			if (tracks.scrollWidth == tracks.scrollLeft + tracks.offsetWidth) {
				tracks_next_btn.setAttribute("disabled", "");
			}
		}, 500);
	};
	tracks_previous_btn.onclick = function () {
		tracks.scrollBy({
			left: -tracks.offsetWidth,
			behavior: "smooth",
		});
		setTimeout(() => {
			if (tracks.scrollLeft === 0) {
				tracks_previous_btn.setAttribute("disabled", "");
			}
			tracks_next_btn.removeAttribute("disabled");
		}, 500);
	};
	setTimeout(() => {
		if (!(tracks.scrollWidth > tracks.offsetWidth)) {
			tracks_next_btn.setAttribute("disabled", "");
		}
	}, 50);
};
