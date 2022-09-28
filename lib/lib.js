import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpegprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffmpegprobe.path);
import Datastore from "nedb";
const database = new Datastore("database.db");
const loadDb = database.loadDatabase();

function padTo2Digits(num) {
	return num.toString().padStart(2, "0");
}

function formatDuration(duration) {
	(duration, "202");
	let minutes = Math.floor(duration / 60);
	let seconds = Math.round(duration % 60);
	let duration_formated = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
	return duration_formated;
}

function createThumbnail(duration, name, filename) {
	if (duration === undefined || duration === null) {
		res.status(500);
		res.send("<h1>500 Internal Server Error</h1>");
	}
	if (duration < 10) {
		duration = Math.round(duration - 1);
	}
	if (duration >= 10) {
		duration = 10;
	}

	ffmpeg(__dirname + `/public/Media/${filename}`).takeScreenshots(
		{
			count: 1,
			timemarks: [duration],
			filename: name,
			//size: '1980x1080'
		},
		__dirname + `/public/thumbnails/`,
		function (err) {
			res.status(500);
			res.send("<h1>500 Internal Server Error</h1>");
			return;
		}
	);
}

export { formatDuration, createThumbnail, loadDb, database, ffmpeg, ffmpegInstaller, ffmpegprobe };
