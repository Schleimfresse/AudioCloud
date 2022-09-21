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
const play = document.getElementById("player-play");
const autoplay_checkbox = document.getElementById("player-autoplay-checkbox");
const fullscreen = document.getElementById("fullscreen-btn");
const video_wrapper = document.getElementById("video-wrapper");
const video_controles_wrapper = document.querySelector("AudioCloud-Song-Media-Controls");
const video_controls = document.getElementById("player-video-controles");
const recent_volume = document.querySelector("#volume");
const volume_icon = document.getElementById("volume_icon");
const Title = document.querySelector("AudioCloud-TrackTitle-inner");
const Description = document.querySelector("AudioCloud-Description");
const AddedOn = document.querySelector("AudioCloud-AddedOn");
const Artist = document.querySelector("AudioCloud-Artist");
const previous = document.getElementById("previous_track");
const next = document.getElementById("next_track");
video.onclick = function () {
	justplay();
};
if (localStorage.getItem("AudioCloud") != null) {
	const AudioCloud = JSON.parse(localStorage.getItem("AudioCloud"));
	autoplay = AudioCloud.autoplay;
	video.volume = AudioCloud.volume;
	recent_volume.value = AudioCloud.volume * 100;
	recent_volume.style.backgroundSize = JSON.parse(localStorage.getItem("AudioCloud")).volume * 100 + "% 100%";
	if (AudioCloud.autoplay === true) {
		autoplay_checkbox.setAttribute("checked", true);
	}
} else {
	autoplay = true;
	video.volume = 0.5;
	localStorage.setItem("AudioCloud", JSON.stringify({ autoplay: true, volume: 0.7 }));
	autoplay_checkbox.setAttribute("checked", true);
	recent_volume.style.backgroundSize = JSON.parse(localStorage.getItem("AudioCloud")).volume * 100 + "% 100%";
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
		console.log(e);
		const div = document.getElementById("card-template").content.cloneNode(true);
		div.children[0].setAttribute(
			"onclick",
			`history.pushState(null, null, '/Player/${e.name}'); load_track(${index});`
		);
		div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
		div.querySelector("[artist]").textContent = e.artist;
		div.querySelector("[title]").textContent = e.title;
		document.getElementById("next_media_list").append(div);
	});
	Playlist.unshift(currentMedium);
	load_track(song_index);
}

RetrieveData();

// Player functions

function next_song() {
	if (song_index < Playlist.length - 1) {
		song_index += 1;
		history.pushState(null, null, `/Player/${Playlist[song_index].name}`);
		load_track(song_index);
		playsong();
	} else {
		song_index = 0;
		history.pushState(null, null, `/Player/${Playlist[song_index].name}`);
		load_track(song_index);
		playsong();
	}
}

function previous_song() {
	if (song_index > 0) {
		song_index -= 1;
		history.pushState(null, null, `/Player/${Playlist[song_index].name}`);
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
	}
	if (!isNaN(video.buffered.end(video.buffered.length - 1))) {
		position = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
		buffered_progress.value = position;
	}
	slider.style.backgroundSize = ((slider.value - slider.min) * 100) / (slider.max - slider.min) + "% 100%";

	video.onended = () => {
		if (autoplay == true) {
			if (song_index < Playlist.length - 1) {
				song_index += 1;
				load_track(song_index);
				playsong();
			} else {
				play.innerHTML = '<img class="icons icon-size-large" src="../svg/play.svg" alt="play" />';
			}
		}
	};
}

video.addEventListener("play", () => {
	Playing_song = true;
	play.innerHTML = '<img class="icons icon-size-large" src="../svg/pause.svg" alt="pause" />';
});

video.addEventListener("pause", () => {
	Playing_song = false;
	play.innerHTML = '<img class="icons icon-size-large" src="../svg/play.svg" alt="play" />';
});

video_wrapper.addEventListener("mouseover", () => {
	video_controls.style.opacity = 1;
});

video_controles_wrapper.addEventListener("click", () => {
	justplay();
});

video_wrapper.addEventListener("mouseout", () => {
	video_controls.style.opacity = 0;
});

window.addEventListener("keydown", (e) => {
	if (e.code === "Space") {
		e.preventDefault();
		justplay();
	}
	if (e.code === "KeyF") {
		video.requestFullscreen();
	}
});

fullscreen.addEventListener("click", (e) => {
	video.requestFullscreen();
});

recent_volume.addEventListener("input", (e) => {
	volume_change(e.path[0].value);
});

volume_icon.addEventListener("click", () => {
	mute_sound();
});

autoplay_checkbox.addEventListener("click", () => {
	autoplay_switch();
});

slider.addEventListener("input", () => {
	change_duration();
});

play.addEventListener("click", () => {
	justplay();
});

previous.addEventListener("click", () => {
	previous_song();
});

next.addEventListener("click", () => {
	next_song();
});

function justplay() {
	if (Playing_song == false) {
		playsong();
	} else {
		pausesong();
	}
}

function load_track(index) {
	clearInterval(timer);
	reset_slider();
	video.src = `/Media/${Playlist[index].name}`;
	document.title = `AudioCloud | ${Playlist[index].title}`;
	Title.innerText = Playlist[index].title;
	//track_image.src = ;
	video.poster = `/thumbnails/${Playlist[index].thumbnail}`;
	Artist.innerText = Playlist[index].artist;
	Description.innerText = Playlist[index].desc;
	video.load();
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
	} else {
		volume_icon.src = "../svg/volume-high-outline.svg";
		video.muted = false;
		video.volume = JSON.parse(localStorage.getItem("AudioCloud")).volume;
		recent_volume.value = JSON.parse(localStorage.getItem("AudioCloud")).volume * 100;
		recent_volume.style.backgroundSize =
			JSON.parse(localStorage.getItem("AudioCloud")).volume * 100 + "% 100%";
	}
}
