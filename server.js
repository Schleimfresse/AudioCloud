const express = require("express");
const Datastore = require("nedb");
const upload = require("express-fileupload");
const app = express();
const path = require("path");
const fs = require("fs");

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
		res.render(__dirname + "/public/views/player.ejs", { data: { medium: req.params.id, info: JSON.stringify(data) } });
	});
});

app.post("/uploadstatus", (req, res) => {
	if (req.files) {
		let file = req.files.file;
		let filename = file.name;
		file.mv("./public/Media/" + filename, function (err) {
			if (err) {
				res.status(500);
				res.send(err);
			} else {
				database.insert({ name: filename, desc: req.body.desc, artist: req.body.artist, title: req.body.title });
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
