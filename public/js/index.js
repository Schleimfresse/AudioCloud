const skel_cardTemplate = document.getElementById("skeleton-card-template");
const cardTemplate = document.getElementById("card-template");
const main = document.getElementById("Media_Showcase_wrapper");
const contextmenu = document.getElementById("contextmenu");
const addToPlaylist = document.getElementById("addToPlaylist");
const notification_box = document.getElementById("notification-banner");
for (let i = 0; i < 30; i++) {
	main.append(skel_cardTemplate.content.cloneNode(true));
}

window.onload = function () {
	async function load() {
		const res = await fetch("/api");
		const data = await res.json();
		main.textContent = "";
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
				console.log(this);
				console.log(e.path);
				console.log(e.composedPath().includes(this));
				if (e.composedPath().includes(this)) {
					contextmenu.setAttribute("current", this.getAttribute("data-track"));
				}
				return false;
			};
			div.querySelector("[link]").href = `./player?v=${e.id}`;
			div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
			div.querySelector("[title]").textContent = e.title;
			main.append(div);
		});
	}
	load();
};

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

window.addEventListener("click", onContextmenu);

const displayNotification = (data) => {
	contextmenu.style.display = "none";
	notification_box.setAttribute("data-visibility", "");
	notification_box.textContent = data.message;
	setTimeout(() => {
		notification_box.removeAttribute("data-visibility", "");
	}, 3000);
};

addToPlaylist.addEventListener("click", (e) => {
	console.log(addToPlaylist.parentElement.getAttribute("current"));
	fetch("/playlist/add", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			id: addToPlaylist.parentElement.getAttribute("current"),
			playlist: "2f7if0a40l8xcc87p",
		}),
	})
		.then((res) => res.json())
		.then((data) => displayNotification(data));
});
