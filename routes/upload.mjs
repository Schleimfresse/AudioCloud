import express from "express";
import fs from "fs";
import uniqid from "uniqid";
import * as Lib from "../lib/lib.js";
import path from "path";
import { fileTypeFromFile } from "file-type";
import jsmediatags from "jsmediatags";
let router = express.Router();

router.get("/", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/upload.html");
});

router.post("/", async (req, res) => {
	if (req.files || req.body.title != "") {
		let file = req.files.file;
		let thumbnail = req.files.thumbnail;
		let thumbnail_autocreate = true;
		let img_ext = ".png";
		let ext = path.extname(file.name);
		let uniqid_inst = uniqid();
		let filename = uniqid_inst + ext;
		let thumbnail_name = uniqid_inst;
		let description = req.body.desc;
		let artist = req.body.artist;

		if (!file.mimetype.includes("audio/")) {
			if (!file.mimetype.includes("video/")) {
				res.status(400);
				res.send(`<h1>400 Bad request</h1><p>Invalid filetype: ${req.files.file.mimetype}</p>`);
				return;
			}
		}
		file.mv(__dirname + `/public/Media/${filename}`, async function (err) {
			const getMetadata = new Promise((resolve, reject) => {
				Lib.ffmpeg.ffprobe(__dirname + `/public/Media/${filename}`, (err, metadata) => {
					if (err) {
						reject(false);
					}
					resolve(metadata.format);
				});
			});
			let metadata = await getMetadata;
			if (thumbnail !== undefined) {
				img_ext = path.extname(thumbnail.name);
				if (thumbnail.mimetype.includes("image/")) {
					thumbnail_autocreate = false;
					thumbnail.mv(__dirname + `/thumbnails/${thumbnail_name + img_ext}`, async function (err) {
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
			} else if (thumbnail == undefined) {
				console.log("Buffer !");
				jsmediatags.read(__dirname + `/public/Media/${filename}`, {
					onSuccess: async function (tag) {
						console.log(tag);
						let image = tag.tags.picture;
						if (image) {
							thumbnail_autocreate = false;
							let Img_Buffer = Buffer.from(image.data);
							fs.writeFile(
								__dirname + `/public/thumbnails/${thumbnail_name + img_ext}`,
								Img_Buffer,
								(err) => {
									if (!err) console.log("Image data written");
								}
							);
						} else {
							console.log("other options");
							if (file.mimetype.includes("video/") && thumbnail_autocreate == true) {
								console.log("createThumbnail");
								Lib.createThumbnail(metadata, thumbnail_name, filename);
							} else {
								console.log("music note");
								thumbnail_autocreate = false;
								thumbnail_name = Lib.STANDARD_THUMBNAIL;
								img_ext = Lib.STANDARD_THUMBNAIL_EXT;
							}
							console.log(thumbnail_autocreate);
						}
					},
					onError: async function () {
						if (file.mimetype.includes("video/") && thumbnail_autocreate == true) {
							console.log("createThumbnail");
							Lib.createThumbnail(metadata, thumbnail_name, filename);
						} else {
							console.log("music note");
							thumbnail_autocreate = false;
							thumbnail_name = Lib.STANDARD_THUMBNAIL;
							img_ext = Lib.STANDARD_THUMBNAIL_EXT;
						}
					},
				});
			}
			if (err) {
				res.status(500);
				res.send("<h1>500 Internal Server Error</h1>");
				return;
			} else {
				const date = new Date();
				const Db_duration = Lib.formatDuration(metadata.duration);
				const type = await fileTypeFromFile(__dirname + "/public/Media/" + filename);
				const added_date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
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
				if (metadata.tags != undefined) {
					if (req.body.desc == "" && metadata.tags.description != undefined) {
						description = metadata.tags.description;
					}
					if (req.body.artist == "" && metadata.tags.artist != undefined) {
						artist = metadata.tags.artist;
					}
				}
				Lib.database.insert(
					{
						name: filename,
						searchquery: req.body.title.toLowerCase(),
						type: "track",
						desc: description,
						artist: artist,
						title: req.body.title,
						mime: type,
						added: added_date,
						thumbnail: thumbnail_name + img_ext,
						id: uniqid_inst,
						str_duration: Db_duration,
						int_duration: Math.round(metadata.duration),
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
