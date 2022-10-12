const contextmenu = document.getElementById("contextmenu");
const addToPlaylist = document.getElementById("addToPlaylist");
const notification_box = document.getElementById("notification-banner");

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
			playlist: "2f7if0ohgl90ed993",
		}),
	})
		.then((res) => res.json())
		.then((data) => displayNotification(data));
});
