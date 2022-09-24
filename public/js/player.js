let timer;
let autoplay;
let Playing_song = false;
let Playlist;
let song_index = 0;
let if_statment_interupt = false;
const slider = document.getElementById("player-track-duration-slider");
const buffered_progress = document.getElementById("player-track-buffered-progress");
const video = document.createElement("video");
video.id = "player-video-element";
video.innerText = "Sorry, your browser doesn't support embedded videos/audios";
video.setAttribute("fullscreen", "false");
const play = document.getElementById("player-play");
const timestamp = document.getElementById("player-controles-timestamp");
const autoplay_checkbox = document.getElementById("player-autoplay-checkbox");
const fullscreen = document.getElementById("fullscreen-btn");
const video_wrapper = document.getElementById("video-wrapper");
const AudioCloud_Controls = document.querySelector("AudioCloud-Controls");
const video_controls = document.getElementById("player-video-controles");
const recent_volume = document.querySelector("#volume");
const volume_icon = document.getElementById("volume_icon");
const Title = document.querySelector("AudioCloud-TrackTitle-inner");
const Description = document.querySelector("AudioCloud-Description");
const AddedOn = document.querySelector("AudioCloud-AddedOn");
const Artist = document.querySelector("AudioCloud-Artist");
const previous = document.getElementById("previous_track");
const next = document.getElementById("next_track");
const pip = document.getElementById("pip-btn");
const shuffle = document.getElementById("shuffle-btn");
const repeat_btn = document.getElementById("repeat-btn");
const next_medium_list = document.getElementById("next_media_list");
const exit_fullscreen = document.getElementById("exit_fullscreen_btn");
const isPiPAvailable = () => {
	return document.pictureInPictureEnabled || !video.disablePictureInPicture;
};
if (!isPiPAvailable()) pip.remove();
if (localStorage.getItem("AudioCloud") != null) {
	const AudioCloud = JSON.parse(localStorage.getItem("AudioCloud"));
	autoplay = AudioCloud.autoplay;
	video.volume = AudioCloud.volume;
	recent_volume.value = AudioCloud.volume * 100;
	repeat = AudioCloud.repeat;
	if (repeat === "no_repeat") repeat_btn.classList.add("iron-icon");
	else if (repeat === "repeat_one") repeat_btn.src = "../svg/repeat-one.svg";
	if (AudioCloud.volume === 0) volume_icon.src = "../svg/volume-off-outline.svg";
	recent_volume.style.backgroundSize = JSON.parse(localStorage.getItem("AudioCloud")).volume * 100 + "% 100%";
	if (AudioCloud.autoplay === true) {
		autoplay_checkbox.setAttribute("checked", true);
	}
} else {
	autoplay = true;
	repeat = "no_repeat";
	video.volume = 0.7;
	localStorage.setItem("AudioCloud", JSON.stringify({ autoplay: true, volume: 0.7, repeat: "no_repeat" }));
	autoplay_checkbox.setAttribute("checked", true);
	recent_volume.style.backgroundSize = JSON.parse(localStorage.getItem("AudioCloud")).volume * 100 + "% 100%";
	repeat_btn.classList.add("iron-icon");
}
document.getElementById("video-wrapper").append(video);
document.title = `AudioCloud | ${information.title}`;

// Initialisation end

async function RetrieveData() {
	const res = await fetch("/api");
	Playlist = await res.json();
	const currentMediumIndex = Playlist.findIndex((e) => {
		return e.name == filename;
	});
	const currentMedium = Playlist.find((e) => {
		return e.name == filename;
	});
	Playlist.splice(currentMediumIndex, 1);
	let index = 0;
	Playlist.forEach((e) => {
		index++;
		createCard(e, index);
	});
	Playlist.unshift(currentMedium);
	load_track(song_index);
}

RetrieveData();

function createCard(e, index) {
	console.log(e, index);
	e.song_index = index;
	const div = document.getElementById("card-template").content.cloneNode(true);
	div.children[0].setAttribute(
		"onclick",
		`history.pushState(null, null, '/Player/${e.id}'); load_track(${index});`
	);
	if (RetrieveThumbnailforList(e)) {
		div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
	} else {
		div.querySelector("[thumbnail]").src = "/svg/musical-notes-outline-gray.svg";
	}
	div.querySelector("[artist]").textContent = e.artist;
	div.querySelector("[title]").textContent = e.title;
	next_medium_list.append(div);
}

// Player functions

function next_song() {
	if (song_index < Playlist.length - 1) {
		song_index += 1;
		console.log(song_index);
		history.pushState(null, null, `/Player/${Playlist[song_index].id}`);
		load_track(song_index);
		playsong();
	} else {
		song_index = 0;
		history.pushState(null, null, `/Player/${Playlist[song_index].id}`);
		load_track(song_index);
		playsong();
	}
}

function previous_song() {
	if (song_index > 0) {
		song_index -= 1;
		history.pushState(null, null, `/Player/${Playlist[song_index].id}`);
		load_track(song_index);
		playsong();
	}
}

function change_duration() {
	slider_position = video.duration * (slider.value / 100);
	video.currentTime = slider_position;
	slider.style.backgroundSize = ((slider.value - slider.min) * 100) / (slider.max - slider.min) + "% 100%";
}

function range_slider() {
	let position = 0;
	if (!isNaN(video.duration)) {
		position = video.currentTime * (100 / video.duration);
		slider.value = position;
		const minutes = Math.floor(video.currentTime / 60);
		const seconds = Math.round(video.currentTime % 60);
		timestamp.children[0].textContent = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
	}
	if (!isNaN(video.buffered.end(video.buffered.length - 1))) {
		position = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
		buffered_progress.value = position;
	}
	slider.style.backgroundSize = ((slider.value - slider.min) * 100) / (slider.max - slider.min) + "% 100%";

	video.onended = () => {
		if (autoplay == true) {
			if (repeat === "repeat_one") {
				video.currentTime = 0;
				playsong();
			} else if (song_index < Playlist.length - 1) {
				song_index += 1;
				load_track(song_index);
				playsong();
			} else {
				if (repeat) {
					song_index = 0;
					load_track(song_index);
				} else {
					play.innerHTML = '<img class="icons icon-size-large" src="../svg/play.svg" alt="play" />';
				}
			}
		}
	};
}

video.addEventListener("play", () => {
	Playing_song = true;
	play.innerHTML =
		'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>';
});

video.addEventListener("pause", () => {
	Playing_song = false;
	play.innerHTML =
		'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>';
});

video_wrapper.addEventListener("mouseover", () => {
	video_controls.style.opacity = 1;
});

video.addEventListener("click", () => {
	justplay();
});

video.addEventListener("fullscreenchange", () => {
	if (document.fullscreenElement) {
		AudioCloud_Controls.setAttribute("fullscreen", "true");
		video.setAttribute("fullscreen", "true");
	} else if (!document.fullscreenElement) {
		AudioCloud_Controls.setAttribute("fullscreen", "false");
		video.setAttribute("fullscreen", "false");
	}
});

video_wrapper.addEventListener("mouseout", () => {
	video_controls.style.opacity = 0;
});

window.addEventListener("keydown", (e) => {
	switch (e.code.toLowerCase()) {
		case "space":
			e.preventDefault();
			justplay();
			break;
		case "keyf":
			video_wrapper.requestFullscreen();
			break;
		case "keym":
			mute_sound();
			break;
		case "keyk":
			justplay();
	}
});

fullscreen.addEventListener("click", () => {
	if (!document.fullscreenElement) {
		video_wrapper.requestFullscreen();
	}
});

exit_fullscreen.addEventListener("click", () => {
	if (document.fullscreenElement) {
		document.exitFullscreen();
	}
});

document.addEventListener("fullscreenchange", switch_fullscreen);

recent_volume.addEventListener("input", (e) => {
	volume_change(e.path[0].value);
});

volume_icon.addEventListener("click", mute_sound);

autoplay_checkbox.addEventListener("click", autoplay_switch);

//slider.addEventListener("change", change_duration());

slider.addEventListener("input", change_duration);

play.addEventListener("click", justplay);

previous.addEventListener("click", previous_song);

next.addEventListener("click", next_song);

pip.addEventListener("click", pip_player);

shuffle.addEventListener("click", () => {
	shuffle_f(Playlist);
});

repeat_btn.addEventListener("click", switch_repeat);

function switch_fullscreen() {
	if (!document.fullscreenElement) {
		fullscreen.style.display = "flex";
		exit_fullscreen.style.display = "none";
		AudioCloud_Controls.setAttribute("fullscreen", "false");
	} else if (document.fullscreenElement) {
		fullscreen.style.display = "none";
		exit_fullscreen.style.display = "flex";
		AudioCloud_Controls.setAttribute("fullscreen", "true");
	}
}

function switch_repeat() {
	let ls = JSON.parse(localStorage.getItem("AudioCloud"));
	switch (repeat) {
		case "repeat":
			console.log("repeat");
			repeat = "repeat_one";
			repeat_btn.src = "../svg/repeat-one.svg";
			ls.repeat = repeat;
			localStorage.setItem("AudioCloud", JSON.stringify(ls));
			break;
		case "repeat_one":
			console.log("repeat_one");
			repeat = "no_repeat";
			repeat_btn.src = "../svg/repeat.svg";
			ls.repeat = repeat;
			localStorage.setItem("AudioCloud", JSON.stringify(ls));
			repeat_btn.classList.add("iron-icon");
			break;
		case "no_repeat":
			console.log("no_repeat");
			repeat = "repeat";
			ls.repeat = repeat;
			localStorage.setItem("AudioCloud", JSON.stringify(ls));
			repeat_btn.classList.remove("iron-icon");
			break;
	}
}

function justplay() {
	if (Playing_song == false) {
		playsong();
	} else {
		pausesong();
	}
}

function padTo2Digits(num) {
	return num.toString().padStart(2, "0");
}

function RetrieveThumbnail(index) {
	let request = new XMLHttpRequest();
	let url = `/thumbnails/${Playlist[index].thumbnail}`;
	request.open("HEAD", url, false);
	request.send();
	return request.status != 404;
}

function load_track(index) {
	history.pushState(null, null, `/Player/${Playlist[index].id}`);
	clearInterval(timer);
	reset_slider();
	video.src = `/Media/${Playlist[index].name}`;
	document.title = `AudioCloud | ${Playlist[index].title}`;
	Title.innerText = Playlist[index].title;
	Artist.innerText = Playlist[index].artist;
	Description.innerText = Playlist[index].desc;
	video.load();
	if (RetrieveThumbnail(index)) {
		video.poster = `/thumbnails/${Playlist[index].thumbnail}`;
	} else {
		video.poster = "/svg/musical-notes-outline-gray.svg";
	}
	if (Playlist[index].mime.mime.includes("audio")) {
		hideMiniplayer();
	} else {
		showMiniplayer();
	}
	video.onloadedmetadata = function () {
		const minutes = Math.floor(video.duration / 60);
		const seconds = Math.round(video.duration % 60);
		timestamp.children[1].textContent = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
		timestamp.children[0].textContent = "00:00";
	};
	justplay();

	timer = setInterval(range_slider, 1000);
}

function autoplay_switch() {
	if (autoplay == true) {
		autoplay = false;
		let ls = JSON.parse(localStorage.getItem("AudioCloud"));
		ls.autoplay = autoplay;
		localStorage.setItem("AudioCloud", JSON.stringify(ls));
	} else {
		autoplay = true;
		let ls = JSON.parse(localStorage.getItem("AudioCloud"));
		ls.autoplay = autoplay;
		localStorage.setItem("AudioCloud", JSON.stringify(ls));
	}
}

function reset_slider() {
	slider.value = 0;
}

function playsong() {
	video.play();
}

function pausesong() {
	video.pause();
}

function volume_change(value) {
	video.muted = false;
	let ls = JSON.parse(localStorage.getItem("AudioCloud"));
	ls.volume = value / 100;
	localStorage.setItem("AudioCloud", JSON.stringify(ls));
	video.volume = JSON.parse(localStorage.getItem("AudioCloud")).volume;
	recent_volume.style.backgroundSize = JSON.parse(localStorage.getItem("AudioCloud")).volume * 100 + "% 100%";
	if (video.volume === 0) {
		volume_icon.src = "../svg/volume-off-outline.svg";
	} else {
		volume_icon.src = "../svg/volume-high-outline.svg";
	}
}

function mute_sound() {
	if (video.muted === false) {
		video.muted = true;
		recent_volume.value = 0;
		volume_icon.src = "../svg/volume-mute-outline.svg";
		recent_volume.style.backgroundSize = "0% 100%";
	} else {
		if (video.volume === 0) {
			volume_icon.src = "../svg/volume-off-outline.svg";
		} else {
			volume_icon.src = "../svg/volume-high-outline.svg";
		}
		video.muted = false;
		video.volume = JSON.parse(localStorage.getItem("AudioCloud")).volume;
		recent_volume.value = JSON.parse(localStorage.getItem("AudioCloud")).volume * 100;
		recent_volume.style.backgroundSize =
			JSON.parse(localStorage.getItem("AudioCloud")).volume * 100 + "% 100%";
	}
}

function pip_player() {
	try {
		if (!document.pictureInPictureElement) {
			video.requestPictureInPicture();
		} else {
			document.exitPictureInPicture();
		}
	} catch (err) {
		console.error(err);
	}
}

function hideMiniplayer() {
	if (isPiPAvailable) {
		pip.style.display = "none";
	}
}

function showMiniplayer() {
	if (isPiPAvailable) {
		pip.style.display = "flex";
	}
}

function shuffle_f(array) {
	let currentMedium = array.splice(song_index, 1);
	song_index = 0;
	let currentIndex = array.length,
		randomIndex;
	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	array.unshift(currentMedium.shift());
	next_medium_list.textContent = "";
	index = -1;
	array.forEach((e) => {
		index++;
		createCard(e, index);
	});
	return array;
}
