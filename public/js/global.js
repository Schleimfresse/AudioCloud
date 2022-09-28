const account_card = document.getElementById("account-card");
const account_icon = document.getElementById("account-icon");
const settings_btn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settings_list = document.getElementById("settings-listbox");
const settings_close = document.getElementById("settings-close");
const video_playback_switch = document.getElementById("video_playback_switch");

if (localStorage.getItem("AudioCloud") != null) {
	videoPlayback = JSON.parse(localStorage.getItem("AudioCloud")).playback;
	if (!videoPlayback) {
		video_playback_switch.setAttribute("checked", true);
	}
}
function validation(inputfield) {
	if (inputfield.value == "") {
		return false;
	}
}

function switch_account_card_visibility() {
	if (account_card.getAttribute("visibility") === "false") {
		window.addEventListener("click", (e) => {
			if (!(e.path[0].id == "account-card")) {
				if (!(e.path[0].id == "account-icon")) {
					account_card.setAttribute("visibility", "false");
				}
			}
		});
		account_card.setAttribute("visibility", "true");
	} else if (account_card.getAttribute("visibility") === "true") {
		account_card.setAttribute("visibility", "false");
	}
}

const switch_settings_visibility = (e) => {
	if (settings.open === true) {
		const rect = settings.getBoundingClientRect();
		var isInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			settings.close();
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

settings_close.addEventListener("click", () => {
	settings.close();
});
settings.addEventListener("click", switch_settings_visibility);

settings_btn.addEventListener("click", (e) => {
	switch_account_card_visibility;
	settings.showModal();
});
account_icon.addEventListener("click", switch_account_card_visibility);

settings_list.addEventListener("click", (e) => {
	document.querySelector('[data-active="true"]').setAttribute("data-active", "false");

	e.path[0].setAttribute("data-active", "true");
});

video_playback_switch.addEventListener("click", video_playback);
