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
const video_controls = document.getElementById("player-video-controles");
let Title = document.querySelector("AudioCloud-TrackTitle-inner");
let Description = document.querySelector("AudioCloud-Description");
let AddedOn = document.querySelector("AudioCloud-AddedOn");
let Artist = document.querySelector("AudioCloud-Artist");
video.onclick = function () {
	justplay();
};
if (localStorage.getItem("autoplay") != null) {
	autoplay = JSON.parse(localStorage.getItem("autoplay"));
	if (autoplay === true) {
		autoplay_checkbox.setAttribute("checked", true);
	}
} else {
	autoplay = true;
	localStorage.setItem("autoplay", JSON.stringify(autoplay));
	autoplay_checkbox.setAttribute("checked", true);
}

document.getElementById("video-wrapper").append(video);
document.title = `AudioCloud | ${information.title}`;

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

video.addEventListener("click", () => {
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
		localStorage.setItem("autoplay", JSON.stringify(autoplay));
	} else {
		autoplay = true;
		localStorage.setItem("autoplay", JSON.stringify(autoplay));
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

let recent_volume = document.querySelector("#volume");
let volume_show = document.querySelector("#volume_show");

function volume_change() {
	volume_show.innerHTML = recent_volume.value;
	video.volume = recent_volume.value / 100;
}

function mute_sound() {
	video.volume = 0;
	volume.value = 0;
	volume_show.innerHTML = 0;
}
