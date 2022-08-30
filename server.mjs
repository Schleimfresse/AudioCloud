import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const uniqid = require("uniqid");
const Datastore = require("nedb");
const upload = require("express-fileupload");
const app = express();
const date = new Date();
const path = require("path");
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fs = require("fs");
import { fileTypeFromFile } from "file-type";
const port = process.env.PORT || 3000;
const server = require("http").createServer(app);
app.use(require("body-parser").json({ limit: "1mb" }));
app.use(upload());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views/"));
app.use(express.urlencoded({ extended: true })),
	server.listen(port, () => {
		console.log(`app listening at Port: ${port}`);
	});
const database = new Datastore("database.db");
database.loadDatabase();

app.get("/", (req, res) => {
	res.status(200);
});

app.get("/upload", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/upload.html");
});

app.get("/delete", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/delete.html");
});

app.get("/search", (req, res) => {
	let searchquery = req.query.query.toLowerCase();
	let searchquery_letters = searchquery.split("");
	database.find({}, (err, data) => {
		let filtered = [];
		if (req.query.mode == "standard") {
			let i = 0;
			data.forEach((e) => {
				for (let letter of searchquery_letters) {
					console.log(e.searchquery.includes(letter));
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
				if (e.searchquery.includes(searchquery)) {
					filtered.push(e);
				}
			});
		}
		res.status(200);
		res.render(__dirname + "/public/views/search.ejs", {
			data: JSON.stringify(filtered),
		});
	});
});

app.delete("/Media/:id", (req, res) => {
	try {
		database.remove({ name: req.params.id });
		fs.unlink(`./public/Media/${req.params.id}`, () => {
			res.status(204);
			res.sendFile(__dirname + "/public/success.html");
		});
	} catch (err) {
		res.status(500);
	}
});
app.get("/Player/:id", (req, res) => {
	database.find({ name: req.params.id }, (err, data) => {
		if (err || data === null) {
			res.status(500);
			res.send("Information could not be accessed.");
			res.end();
			return;
		}
		data = data.shift();
		console.log(data);
		res.status(200);
		res.render(__dirname + "/public/views/player.ejs", {
			data: { medium: req.params.id, info: JSON.stringify(data) },
		});
	});
});

app.get("/edit", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/edit.html");
});

app.post("/upload", async (req, res) => {
	if (req.files) {
		let file = req.files.file;
		let ext = path.extname(file.name);
		let filename = uniqid() + ext;
		let thumbnail = "thumbnail.png";
		file.mv(`./public/Media/${filename}`, async function (err) {
			if (err) {
				res.status(500);
				res.send(err);
			} else {
				let type = await fileTypeFromFile("./public/Media/" + filename);
				let added_date = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
				database.insert({
					name: filename,
					searchquery: req.body.title.toLowerCase(),
					desc: req.body.desc,
					artist: req.body.artist,
					title: req.body.title,
					mime: type,
					added: added_date,
					thumbnail: thumbnail,
				});
				res.status(200);
				res.sendFile(__dirname + "/public/success.html");
			}
		});
	}
});

app.get("/api", (request, response) => {
	database.find({}, (err, data) => {
		if (err) {
			console.log("/api:", err);
			response.end();
			return;
		}
		response.json(data);
	});
});

app.use(function (req, res) {
	res.status(404);
	res.sendFile(__dirname + "/public/404.html");
	return;
});
