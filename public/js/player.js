const video = document.createElement('video');
video.src = `/Media/${filename}`;
video.controls = true;
video.setAttribute('controlsList', 'nodownload')
video.innerText = "Sorry, your browser doesn't support embedded videos/audios"
document.getElementById('video-wrapper').append(video);
// ###################################################################################

document.querySelector('AudioCloud-TrackTitle').innerText = information.title;
document.querySelector('AudioCloud-Description').innerText = information.desc;
document.querySelector('AudioCloud-AddedOn').innerText = information.added;
document.querySelector('AudioCloud-Artist').innerText = information.artist;