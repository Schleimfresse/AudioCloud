const video = document.createElement('video');
video.src = `/Media/${filename}`;
video.controls = true;
video.innerText = "Sorry, your browser doesn't support embedded videos/audios"
document.getElementById('video-wrapper').append(video);
// ###################################################################################

document.querySelector('AudioCloud-TrackTitle').innerText = information.title;
document.querySelector('AudioCloud-Description').innerText = information.desc;
document.querySelector('AudioCloud-Artist').innerText = information.artist;
document.querySelector('AudioCloud-Length').innerText = video.duration;