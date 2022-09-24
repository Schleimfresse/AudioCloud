import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const uniqid = require("uniqid");
const Datastore = require("nedb");
const upload = require("express-fileupload");
const bodyParser = require("body-parser");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffmpegprobe = require("@ffprobe-installer/ffprobe");
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffmpegprobe.path);
const path = require("path");
const fs = require("fs");
const app = express();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { fileTypeFromFile } from "file-type";
const port = process.env.PORT || 3000;
const server = require("http").createServer(app);
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
server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});
const database = new Datastore("database.db");
database.loadDatabase();

app.get("/", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/upload", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/upload.html");
});

app.get("/delete", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/delete.html");
});

app.get("/delete/:id", (req, res) => {
	database.findOne({ name: req.params.id }, (err, data) => {
		if (err || data == null) {
			res.status(500);
			res.send("Data could not be accessed.");
			res.end();
			return;
		}
		res.status(200);
		res.render(__dirname + "/public/views/delete_item.ejs", {
			data: JSON.stringify(data),
		});
	});
});

app.post("/delete/:id/success", (req, res) => {
	try {
		database.remove({ name: req.params.id });
		fs.rmSync(__dirname + `/public/Media/${req.params.id}`, {}, (err) => {
			if (err) {
				res.status(500);
				res.send("<h1>500 Internal Server Error</h1><p>file could not be found.</p>");
			}
		});
		fs.readdir(__dirname + `/public/thumbnails/`, (err, files) => {
			files.forEach((file) => {
				if (file.split(".")[0] == path.parse(req.params.id).name) {
					fs.rmSync(__dirname + `/public/thumbnails/${file}`, {}, (err) => {
						if (err) {
							res.status(500);
							res.send("<h1>500 Internal Server Error</h1><p>file could not be found.</p>");
						}
					});
				}
			});
		});
		res.status(200);
		res.sendFile(__dirname + "/public/html/success.html");
	} catch (err) {
		console.log(err);
		res.status(500);
		res.send("<h1>500 Internal Server Error</h1>");
	}
});

app.get("/edit", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/edit.html");
});

app.get("/edit/:id", (req, res) => {
	database.findOne({ name: req.params.id }, (err, data) => {
		if (err || data == null) {
			res.status(500);
			res.send("Data could not be accessed.");
			res.end();
			return;
		}
		res.status(200);
		res.render(__dirname + "/public/views/edit_item.ejs", {
			data: JSON.stringify(data),
		});
	});
});

app.post("/edit/:id/success", (req, res) => {
	try {
		database.update(
			{ name: req.params.id },
			{
				$set: req.body,
			}
		);
		res.status(200);
		res.sendFile(__dirname + "/public/html/success.html");
	} catch (err) {
		res.status(500);
		res.send("<h1>500 Internal Server Error</h1>");
	}
});

app.get("/search", (req, res) => {
	if (req.query.type != "search" && req.query.type != "edit" && req.query.type != "delete") {
		res.status(400);
		res.send(`<h1>400 Bad request</h1> Searchtype ${req.query.type} does not exist`);
		res.end();
	}
	if (req.query.query) {
		let searchquery = req.query.query.toLowerCase();
		let searchquery_letters = searchquery.split("");
		database.find({}, (err, data) => {
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
	}
	else {
		res.render(__dirname + `/public/views/${req.query.type}.ejs`, {
			data: JSON.stringify(''),
			server_query: JSON.stringify(''),
		});
	}
});

app.get("/Player/:id", (req, res) => {
	database.find({ id: req.params.id }, (err, data) => {
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
		let img_ext = ".png";
		let ext = path.extname(file.name);
		let uniqid_inst = uniqid();
		let filename = uniqid_inst + ext;
		let thumbnail_name = uniqid_inst;
		if (thumbnail !== undefined) {
			img_ext = path.extname(thumbnail.name);
			if (thumbnail.mimetype.includes("image/")) {
				thumbnail_autocreate = false;
				await thumbnail.mv(__dirname + `/public/thumbnails/${thumbnail_name + img_ext}`, function (err) {
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
		}

		if (!req.files.file.mimetype.includes("audio/")) {
			if (!req.files.file.mimetype.includes("video/")) {
				res.status(400);
				res.send(`<h1>400 Bad request</h1><p>Invalid filetype: ${req.files.file.mimetype}</p>`);
				return;
			}
		}
		file.mv(__dirname + `/public/Media/${filename}`, async function (err) {
			if (err) {
				res.status(500);
				res.send("<h1>500 Internal Server Error</h1>");
				return;
			} else {
				const date = new Date();
				let type = await fileTypeFromFile("./public/Media/" + filename);
				let added_date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
				database.insert({
					name: filename,
					searchquery: req.body.title.toLowerCase(),
					desc: req.body.desc,
					artist: req.body.artist,
					title: req.body.title,
					mime: type,
					added: added_date,
					thumbnail: thumbnail_name + img_ext,
					id: uniqid_inst,
				});
				if (thumbnail_autocreate === true) {
					const getDuration = new Promise((resolve, reject) => {
						ffmpeg.ffprobe(__dirname + `/public/Media/${filename}`, (err, metadata) => {
							if (err) {
								reject(false);
							}
							let duration = metadata.format.duration;
							if (duration < 10) {
								resolve(Math.round(duration - 1));
							}
							if (duration >= 10) {
								resolve(10);
							}
						});
					});
					getDuration.then((message) => {
						if (message === false) {
							res.status(500);
							res.send("<h1>500 Internal Server Error</h1>");
						}
						ffmpeg(__dirname + `/public/Media/${filename}`).takeScreenshots(
							{
								count: 1,
								timemarks: [message],
								filename: thumbnail_name,
								//size: '1980x1080'
							},
							__dirname + `/public/thumbnails/`,
							function (err) {
								res.status(500);
								res.send("<h1>500 Internal Server Error</h1>");
								return;
							}
						);
					});
				}
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
	database.find({}, (err, data) => {
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
