function RetrieveThumbnailforList(e) {
	let request = new XMLHttpRequest();
	let url = `/thumbnails/${e.thumbnail}`;
	request.open("HEAD", url, false);
	request.send();
	return request.status != 404;
}