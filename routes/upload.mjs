import express from "express";
import uniqid from "uniqid";
import * as Lib from "../lib/lib.js";
import path from "path";
import { fileTypeFromFile } from "file-type";
let router = express.Router();

router.get("/", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/upload.html");
});

router.post("/", async (req, res) => {
	if (req.files || req.body.title != "" || req.body.artist != "") {
		let file = req.files.file;
		let thumbnail = req.files.thumbnail;
		let thumbnail_autocreate = true;
		let img_ext;
		let ext = path.extname(file.name);
		let uniqid_inst = uniqid();
		let filename = uniqid_inst + ext;
		let thumbnail_name;

		if (!file.mimetype.includes("audio/")) {
			if (!req.files.file.mimetype.includes("video/")) {
				res.status(400);
				res.send(`<h1>400 Bad request</h1><p>Invalid filetype: ${req.files.file.mimetype}</p>`);
				return;
			}
		}
		file.mv(__dirname + `/public/Media/${filename}`, async function (err) {
			const getDuration = new Promise((resolve, reject) => {
				Lib.ffmpeg.ffprobe(__dirname + `/public/Media/${filename}`, (err, metadata) => {
					if (err) {
						reject(false);
					}
					let duration = metadata.format.duration;
					resolve(duration);
				});
			});
			if (thumbnail !== undefined) {
				img_ext = path.extname(thumbnail.name);
				thumbnail_name = uniqid_inst;
				if (thumbnail.mimetype.includes("image/")) {
					thumbnail_autocreate = false;
					thumbnail.mv(__dirname + `/public/thumbnails/${thumbnail_name + img_ext}`, async function (err) {
						if (err) {
							res.status(500);
							res.send("<h1>500 Internal Server Error</h1>");
							return;
						}
					});
				} else {
					res.status(400);
					res.send(`<h1>400 Bad request</h1><p>Invalid filetype: ${req.files.thumbnail.mimetype}</p>`);
				}
			} else if (file.mimetype.includes("video")) {
				thumbnail_name = uniqid_inst;
				img_ext = ".png";
			} else {
				thumbnail_name = Lib.STANDARD_THUMBNAIL;
				img_ext = Lib.STANDARD_THUMBNAIL_EXT;
			}

			if (err) {
				res.status(500);
				res.send("<h1>500 Internal Server Error</h1>");
				return;
			} else {
				const date = new Date();
				const Db_duration = Lib.formatDuration(await getDuration);
				let type = await fileTypeFromFile("./public/Media/" + filename);
				let added_date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
				if (thumbnail_autocreate === true) {
					Lib.createThumbnail(await getDuration, thumbnail_name, filename);
				}
				if (
					filename === null ||
					req.body.title.toLowerCase() === null ||
					type === null ||
					added_date === null ||
					Db_duration === null
				) {
					res.status(500);
					res.send(
						"<h1>500 Internal Server Error</h1><p>Some information for the video could not be generated, try again!</p>"
					);
					return;
				}
				Lib.database.insert(
					{
						name: filename,
						searchquery: req.body.title.toLowerCase(),
						desc: req.body.desc,
						artist: req.body.artist,
						title: req.body.title,
						mime: type,
						added: added_date,
						thumbnail: thumbnail_name + img_ext,
						id: uniqid_inst,
						duration: Db_duration,
					},
					(err, data) => {
						if (err) {
							res.status(500);
							res.send("<h1>500 Internal Server Error</h1>");
							return;
						}
					}
				);
				res.status(200);
				res.sendFile(__dirname + "/public/html/success.html");
			}
		});
	} else {
		res.status(400);
		res.send("<h1>400 Bad request</h1>");
		return;
	}
});

export { router };
