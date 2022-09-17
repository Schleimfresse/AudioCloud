let timer;
let autoplay;
let Playing_song = false;
let Playlist;
let song_index = 0;
let if_statment_interupt = false;
const slider = document.getElementById("player-track-duration-slider");
const video = document.createElement("video");
const play = document.getElementById("player-play");
const autoplay_checkbox = document.getElementById("player-autoplay-checkbox");
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
video.src = `/Media/${filename}`;
video.poster = `/thumbnails/${information.thumbnail}`;
video.setAttribute("controlsList", "nodownload");
video.onclick = function () {
	justplay();
};
video.innerText = "Sorry, your browser doesn't support embedded videos/audios";
video.load();
document.getElementById("video-wrapper").append(video);
document.title = `AudioCloud | ${information.title}`;
document.querySelector("AudioCloud-TrackTitle-inner").innerText = information.title;
document.querySelector("AudioCloud-Description").innerText = information.desc;
document.querySelector("AudioCloud-AddedOn").innerText = information.added;
document.querySelector("AudioCloud-Artist").innerText = information.artist;

async function load() {
	const res = await fetch("/api");
	Playlist = await res.json();
	console.log(Playlist);
	Playlist.forEach((e) => {
		console.log(e);
		const div = document.getElementById("card-template").content.cloneNode(true);
		div.children[0].setAttribute("onclick", `window.location.href = "./${e.name}"`);
		div.querySelector("[thumbnail]").src = `/thumbnails/${e.thumbnail}`;
		div.querySelector("[artist]").textContent = e.artist;
		div.querySelector("[title]").textContent = e.title;
		document.getElementById("next_media_list").append(div);
	});
}
load();

// Player functions

timer = setInterval(range_slider, 1000);

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
	} else {
		song_index = Playlist.length;
		history.pushState(null, null, `/Player/${Playlist[song_index].name}`);
		load_track(song_index);
		playsong();
	}
}

function change_duration() {
	slider_position = video.duration * (slider.value / 100);
	video.currentTime = slider_position;
}

function range_slider() {
	let position = 0;
	if (!isNaN(video.duration)) {
		position = video.currentTime * (100 / video.duration);
		slider.value = position;
	}
	slider.style.backgroundSize = ((slider.value - slider.min) * 100) / (slider.max - slider.min) + "% 100%";

	video.onended = () => {
		if (autoplay == true) {
			if (song_index < Playlist.length - 1) {
				song_index += 1;
				load_track(song_index);
				playsong();
			} else {
				play.innerHTML = '<ion-icon class="icon-size-large" name="play"></ion-icon>';
			}
		}
	};
}

video.addEventListener('play', () => {
	play.innerHTML = '<ion-icon class="icon-size-large" name="pause"></ion-icon>';
})

video.addEventListener('pause', () => {
	play.innerHTML = '<ion-icon class="icon-size-large" name="play"></ion-icon>';
})

window.addEventListener("keydown", (e) => {
	if (e.code === "Space") {
		e.preventDefault();
		justplay();
	}
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
	//title.innerHTML = ;
	//track_image.src = ;
	//artist.innerHTML = ;
	video.load();

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
	Playing_song = true;
}

function pausesong() {
	video.pause();
	Playing_song = false;
}
