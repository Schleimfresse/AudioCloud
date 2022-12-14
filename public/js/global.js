const account_card = document.getElementById("account-card");
const account_icon = document.getElementById("account-icon");
const settings_btn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settings_list = document.getElementById("settings-listbox");
const settings_close = document.getElementById("settings-close");
const video_playback_switch = document.getElementById("video_playback_switch");
const nav_search_btn = document.getElementById("nav-search-btn");
const nav_search = document.getElementById("AudioCloud-nav-bar-search");
const nav_search_wrapper = document.getElementById("AudioCloud-nav-bar-search-wrapper");
const nav_back_arrow = document.getElementById("input-arrow-back");
const nav_bar_input = document.getElementById("searchquery_input");
const searchHistory_DOM = document.getElementById("searchHistory");
const settings_content_page = document.getElementById("settings-content-wrapper");
if (localStorage.AudioCloud != null) {
	videoPlayback = JSON.parse(localStorage.getItem("AudioCloud")).playback;
	if (!videoPlayback) {
		video_playback_switch.setAttribute("checked", true);
	}
}

const getSearchhistory = async () => {
	if (user !== "") {
		const res = await fetch(`/api/searchhistory/${user}`);
		const data = await res.json();
		searchHistory_DOM.textContent = "";
		console.log(data);
		data.history.reverse().forEach((e) => {
			const div = document.getElementById("searchHistory-Temp").content.cloneNode(true);
			div.children[0].onclick = function (event) {
				if (!event.target.classList.contains("ds"))
					window.location.href = `/search?query=${e.value}&mediatype=&type=${e.type}&mode=${e.mode}`;
			};
			div.children[0].children[2].onclick = function () {
				fetch("/search/history/delete", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ value: e.value, user: user }),
				});
				this.parentElement.remove();
				if (searchHistory_DOM.textContent.trim() === "") {
					searchHistory_DOM.remove();
				}
			};
			div.children[0].children[1].textContent = e.value;
			searchHistory_DOM.append(div);
		});
	}
	if (searchHistory_DOM.textContent.trim() === "") {
		searchHistory_DOM.remove();
	}
};

getSearchhistory();

function validation(inputfield, display) {
	if (inputfield.value == "") {
		if (display) {
			inputfield.style.borderBottom = "2px solid #f54242";
		}
		return false;
	}
}

const switch_account_card_visibility = () => {
	if (account_card.getAttribute("visibility") === "false") {
		account_card.setAttribute("visibility", "true");
	} else if (account_card.getAttribute("visibility") === "true") {
		account_card.setAttribute("visibility", "false");
	}
};

const nav_searchbar_switch = (e) => {
	if (nav_search_wrapper.getAttribute("strong-open") === "") return;
	if (!(e.composedPath()[0].id == "account-card")) {
		if (!(e.composedPath()[0].id == "account-icon")) {
			account_card.setAttribute("visibility", "false");
		}
	}
	if (!e.target.classList.contains("nav-search")) {
		nav_search_wrapper.removeAttribute("opened");
		searchHistory_DOM.removeAttribute("visible", "");
	}
};

const switch_modal_visibility = (e, modal) => {
	if (modal.open === true) {
		const rect = modal.getBoundingClientRect();
		const isInDialog =
			rect.top <= e.clientY &&
			e.clientY <= rect.top + rect.height &&
			rect.left <= e.clientX &&
			e.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			modal.close();
		}
	}
};

// Sets if the video stream has to play or not
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

// Changes the content in the Settings modal for the diffrent tabs
const changePageContent = (tab) => {
	switch (tab.textContent) {
		case "General":
			settings_content_page.textContent = "";
			settings_content_page.append(document.getElementById("settings-page-playback").content.cloneNode(true));
			break;
		case "Playback":
			settings_content_page.textContent = "";
			settings_content_page.append(document.getElementById("settings-page-general").content.cloneNode(true));
			break;
		case "Privacy":
			settings_content_page.textContent = "";
			settings_content_page.append(document.getElementById("settings-page-privacy").content.cloneNode(true));
			const deletesearchhistory_btn = document.getElementById("deletesearchhistory");
			deletesearchhistory_btn.onclick = () => {
				fetch("/search/history/deleteall", {
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ user: user }),
				})
					.then((res) => res.json())
					.then((data) => displayNotification(data));
			};
			break;
	}
};

function ContextmenuLogic() {
	this.preventDefault();
	contextmenu.style.display = "flex";
	contextmenu.style.left = this.pageX + "px";
	contextmenu.style.top = this.pageY + "px";
	const elementAttr = this.composedPath().find((e) => e.getAttribute("data-track"));
	console.log(elementAttr);
	if (elementAttr) {
		contextmenu.setAttribute("current", elementAttr.getAttribute("data-track"));
	}
}

settings_btn.addEventListener("click", (e) => {
	switch_account_card_visibility;
	settings.showModal();
});
settings_list.addEventListener("click", (e) => {
	document.querySelector('[data-active="true"]').setAttribute("data-active", "false");
	e.composedPath()[0].setAttribute("data-active", "true");
	const current_tab = document.querySelector("[data-active = 'true']");
	changePageContent(current_tab);
});
account_icon.addEventListener("click", switch_account_card_visibility);
nav_search_btn.addEventListener("click", () => {
	nav_search_wrapper.setAttribute("opened", "");
	searchHistory_DOM.setAttribute("visible", "");
});
settings_close.addEventListener("click", () => settings.close());
settings.addEventListener("click", (e) => switch_modal_visibility(e, settings));
video_playback_switch.addEventListener("click", video_playback);
nav_back_arrow.addEventListener("click", () => {
	nav_search_wrapper.removeAttribute("opened");
	nav_search_wrapper.removeAttribute("strong-open");
	nav_bar_input.value = "";
});
window.addEventListener("click", nav_searchbar_switch);
