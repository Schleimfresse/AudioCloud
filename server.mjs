import express from "express";
import uniqid from "uniqid";
import upload from "express-fileupload";
import bodyParser from "body-parser";
Lib.ffmpegInstaller;
Lib.ffmpegprobe;
Lib.ffmpeg;
import path from "path";
const app = express();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileTypeFromFile } from "file-type";
const port = process.env.PORT || 3000;
import http from "http";
const server = http.createServer(app);
const STANDARD_THUMBNAIL = "musical-notes-outline-gray";
const STANDARD_THUMBNAIL_EXT = ".svg";
import * as Lib from "./lib/lib.js";
import { router as deleteRoute } from "./routes/delete.mjs";
import { router as editRoute } from "./routes/edit.mjs";
global.__dirname = path.resolve(__dirname);

// Middleware
app.use(bodyParser.json({ limit: "1mb" }));
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
app.use(upload());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views/"));
app.use("/delete", deleteRoute);
app.use("/edit", editRoute);

Lib.database;
Lib.loadDb;

server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});

app.get("/", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/upload", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/upload.html");
});

app.get("/search", (req, res) => {
	if (req.query.query != "" || req.query.mode != "" || req.query.type != "") {
		if (req.query.type != "search" && req.query.type != "edit" && req.query.type != "delete") {
			res.status(400);
			res.send(`<h1>400 Bad request</h1> Searchtype ${req.query.type} does not exist`);
			res.end();
		}
		let searchquery = req.query.query.toLowerCase();
		let searchquery_letters = searchquery.split("");
		Lib.database.find({}, (err, data) => {
			let filtered = [];
			if (req.query.mode == "standard") {
				let i = 0;
				data.forEach((e) => {
					for (let letter of searchquery_letters) {
						if (e.searchquery.includes(letter)) {
							i++;
						}
					}
					if (i === searchquery_letters.length) {
						filtered.push(e);
					}
					i = 0;
				});
			} else if (req.query.mode == "strict") {
				data.forEach((e) => {
					if (e.searchquery.includes(searchquery) && e.mime.mime.includes(req.query.mediatype)) {
						filtered.push(e);
					}
				});
			}
			res.status(200);
			res.render(__dirname + `/public/views/${req.query.type}.ejs`, {
				data: JSON.stringify(filtered),
				server_query: JSON.stringify(req.query.query),
			});
		});
	} else {
		res.render(__dirname + `/public/views/${req.query.type}.ejs`, {
			data: JSON.stringify(""),
			server_query: JSON.stringify(""),
		});
	}
});

app.get("/Player", (req, res) => {
	Lib.database.find({ id: req.query.v }, (err, data) => {
		if (err || data === null || data == "") {
			res.status(500);
			res.send("Data could not be accessed.");
			res.end();
			return;
		}
		data = data.shift();
		res.status(200);
		res.render(__dirname + "/public/views/player.ejs", {
			data: { medium: data.name, info: JSON.stringify(data) },
		});
	});
});

app.post("/upload", async (req, res) => {
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
				thumbnail_name = STANDARD_THUMBNAIL;
				img_ext = STANDARD_THUMBNAIL_EXT;
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

app.get("/api", (request, res) => {
	Lib.database.find({}, (err, data) => {
		if (err) {
			res.status(500);
			res.send("<h1>500 Internal Server Error</h1>");
			res.end();
			return;
		}
		res.json(data);
	});
});

app.use(function (req, res) {
	res.status(404);
	res.sendFile(__dirname + "/public/html/404.html");
	return;
});
