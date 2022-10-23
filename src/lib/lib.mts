import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpegprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffmpegprobe.path);
import Datastore from "nedb";
const database = new Datastore("database.db");
const searchhistory_database = new Datastore("searchhistory.db");
const code_database = new Datastore("codes.db");
const history_Database = new Datastore("history.db");
const STANDARD_THUMBNAIL = "musical-notes-outline-gray";
const STANDARD_THUMBNAIL_EXT = ".svg";

const random6DigitNum = () => {
	const num = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000)
	return num;
};
console.log(random6DigitNum());

const padTo2Digits = (num: number) => num.toString().padStart(2, "0");

function formatDuration(duration: number): string {
	let minutes = Math.floor(duration / 60);
	let seconds = Math.round(duration % 60);
	let duration_formated = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
	return duration_formated;
}

function createThumbnail(metadata: { duration: number }, name: string, filename: string) {
	let duration: number;
	if (metadata.duration === undefined || metadata.duration === null) {
		return false;
	}
	if (metadata.duration < 10) {
		duration = Math.round(metadata.duration - 1);
	}
	if (metadata.duration >= 10) {
		duration = 10;
	}

	ffmpeg(__dirname + `/public/assets/media/${filename}`).takeScreenshots(
		{
			count: 1,
			timemarks: [duration],
			filename: name,
			//size: '1980x1080'
		},
		__dirname + `/public/assets/images/`
	);
}

function updateRecentActivity(
	type: string,
	res: {
		status: (arg0: number) => void;
		render: (arg0: string, arg1: { heading: string; desc: string }) => void;
	}
) {
	database.find({ recent_key: "recent" }, {}, (err: any, data: any[]) => {
		data.sort((a: { recent_order: number }, b: { recent_order: number }) => {
			return a.recent_order - b.recent_order;
		});
		data.forEach((e: any) => {
			database.update(e, { $inc: { recent_order: 1 } });
		});
		if (data.length >= 10) {
			let poped = data.pop();
			database.update(
				{ id: poped.id },
				{ $unset: { recent_key: "recent", recent_order: poped.recent_order } }
			);
		}
	});
	console.log("updateRecentActivity", JSON.parse(type));
	database.update(
		{ id: JSON.parse(type) },
		{ $set: { recent_key: "recent", recent_order: 1 } },
		{},
		(err: Error) => {
			if (err) {
				res.status(500);
				res.render(__dirname + "/public/views/error.ejs", {
					heading: "Internal Server Error",
					desc: "Server was not able to access recource and perform required actions!",
				});
				return;
			}
		}
	);
}

function replaceURLs(string: string): string {
	const urlRegex: RegExp = /(((https?:\/\/)|(www\.))[^\s]+)/g;
	return string.replace(urlRegex, function (url: string) {
		let hyperlink: string = url;
		if (!hyperlink.match("^https?://")) {
			hyperlink = "http://" + hyperlink;
		}
		return `<a class="link_std" target="_blank" href="${hyperlink}">${url}</a>`;
	});
}

async function getMetadata(filename: string): Promise<any> {
	const promise: Promise<any> = new Promise((resolve, reject) => {
		ffmpeg.ffprobe(__dirname + `/public/assets/media/${filename}`, (err: any, metadata: any) => {
			if (err) {
				reject(false);
			}
			resolve(metadata.format);
		});
	});
	return promise;
}

export default {
	formatDuration,
	createThumbnail,
	updateRecentActivity,
	random6DigitNum,
	ffmpeg,
	replaceURLs,
	getMetadata,
	database,
	history_Database,
	searchhistory_database,
	code_database,
	ffmpegInstaller,
	ffmpegprobe,
	STANDARD_THUMBNAIL,
	STANDARD_THUMBNAIL_EXT,
};
