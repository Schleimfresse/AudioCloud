import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpegprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffmpegprobe.path);
import Datastore from "nedb";
const database = new Datastore("database.db");
const loadDb = database.loadDatabase();
const STANDARD_THUMBNAIL = "musical-notes-outline-gray";
const STANDARD_THUMBNAIL_EXT = ".svg";

function padTo2Digits(num) {
	return num.toString().padStart(2, "0");
}

function formatDuration(duration) {
	let minutes = Math.floor(duration / 60);
	let seconds = Math.round(duration % 60);
	let duration_formated = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
	return duration_formated;
}

function createThumbnail(metadata, name, filename) {
	let duration;
	if (metadata.duration === undefined || metadata.duration === null) {
		return false;
	}
	if (metadata.duration < 10) {
		duration = Math.round(metadata.duration - 1);
	}
	if (metadata.duration >= 10) {
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
			console.log("ffmpeg error:", err);
			res.status(500);
			res.send("<h1>500 Internal Server Error</h1>");
			return;
		}
	);
}

export {
	formatDuration,
	createThumbnail,
	loadDb,
	database,
	ffmpeg,
	ffmpegInstaller,
	ffmpegprobe,
	STANDARD_THUMBNAIL,
	STANDARD_THUMBNAIL_EXT,
};
