const account_card = document.getElementById("account-card");
const account_icon = document.getElementById("account-icon");
const settings_btn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settings_list = document.getElementById("settings-listbox");
const settings_close = document.getElementById("settings-close");
const video_playback_switch = document.getElementById("video_playback_switch");
const nav_search_btn = document.getElementById("nav-search-btn");
const nav_search = document.getElementById("AudioCloud-nav-bar-search");

if (localStorage.getItem("AudioCloud") != null) {
	videoPlayback = JSON.parse(localStorage.getItem("AudioCloud")).playback;
	if (!videoPlayback) {
		video_playback_switch.setAttribute("checked", true);
	}
}
function validation(inputfield, display) {
	if (inputfield.value == "") {
		if (display) {
			inputfield.style.borderBottom = "2px solid #f54242"
		}
		return false;
	}
}

function switch_account_card_visibility() {
	if (account_card.getAttribute("visibility") === "false") {
		account_card.setAttribute("visibility", "true");
	} else if (account_card.getAttribute("visibility") === "true") {
		account_card.setAttribute("visibility", "false");
	}
}

window.addEventListener("click", (e) => {
	if (!(e.composedPath()[0].id == "account-card")) {
		if (!(e.composedPath()[0].id == "account-icon")) {
			account_card.setAttribute("visibility", "false");
		}
	}
	if (!e.target.classList.contains("nav-search")) {
		nav_search.removeAttribute("opened");
	}
});

const switch_modal_visibility = (e, modal) => {
	if (modal.open === true) {
		const rect = modal.getBoundingClientRect();
		var isInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			modal.close();
		}
	}
};

function video_playback() {
	if (videoPlayback) {
		videoPlayback = false;
		let ls = JSON.parse(localStorage.getItem("AudioCloud"));
		ls.playback = videoPlayback;
		localStorage.setItem("AudioCloud", JSON.stringify(ls));
		video_playback_switch.setAttribute("checked", true);
	} else {
		videoPlayback = true;
		let ls = JSON.parse(localStorage.getItem("AudioCloud"));
		ls.playback = videoPlayback;
		localStorage.setItem("AudioCloud", JSON.stringify(ls));
		video_playback_switch.setAttribute("checked", false);
	}
}

nav_search_btn.addEventListener("click", () => {
	nav_search.setAttribute("opened", "");
});
settings_close.addEventListener("click", () => {
	settings.close();
});
settings.addEventListener("click", (e) => {
	switch_modal_visibility(e, settings)
});

settings_btn.addEventListener("click", (e) => {
	switch_account_card_visibility;
	settings.showModal();
});
account_icon.addEventListener("click", switch_account_card_visibility);

settings_list.addEventListener("click", (e) => {
	document.querySelector('[data-active="true"]').setAttribute("data-active", "false");

	e.composedPath()[0].setAttribute("data-active", "true");
});

video_playback_switch.addEventListener("click", video_playback);

