import express from "express";
import upload from "express-fileupload";
Lib.ffmpegInstaller;
Lib.ffmpegprobe;
Lib.ffmpeg;
import path from "path";
const app = express();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;
import http from "http";
const server = http.createServer(app);
import * as Lib from "./lib/lib.js";
import { router as deleteR } from "./routes/delete.mjs";
import { router as editR } from "./routes/edit.mjs";
import { router as libaryR } from "./routes/libary.mjs";
import { router as uploadR } from "./routes/upload.mjs";
import { router as searchR } from "./routes/search.mjs";
import { router as playlistR } from "./routes/playlists.mjs";
global.__dirname = path.resolve(__dirname);

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views/"));

// Routes

app.use("/delete", deleteR);
app.use("/edit", editR);
app.use("/libary", libaryR);
app.use("/upload", uploadR);
app.use("/search", searchR);
app.use("/playlist", playlistR);

// Database

Lib.database;
Lib.loadDb;

server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});

app.get("/", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/player", (req, res) => {
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

// Error Handeling

app.use(function (req, res) {
	res.status(200);
	res.redirect("/");
});
