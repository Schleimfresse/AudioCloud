
//Initialisation

import express from "express";
import upload from "express-fileupload";
ffmpegInstaller;
ffmpegprobe;
ffmpeg;
import path from "path";
const app = express();
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000;
import http from "http";
const server = http.createServer(app);
import { database, loadDb, ffmpeg, ffmpegInstaller, ffmpegprobe } from "./lib/lib.js";
import { router as deleteR } from "./routes/delete.mjs";
import { router as editR } from "./routes/edit.mjs";
import { router as libraryR } from "./routes/library.mjs";
import { router as uploadR } from "./routes/upload.mjs";
import { router as searchR } from "./routes/search.mjs";
import { router as playlistR } from "./routes/playlists.mjs";
import { router as playerR } from "./routes/player.mjs";
import { router as historyR } from "./routes/history.mjs";
import { router as Api } from "./routes/api.mjs";
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
app.use("/library", libraryR);
app.use("/upload", uploadR);
app.use("/search", searchR);
app.use("/playlist", playlistR);
app.use("/player", playerR);
app.use("/history", historyR);
app.use("/api", Api);

// Database

database;
loadDb;

// Server

server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});

app.get("/", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/index.html");
});

app.get("/privacy", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/privacy.html");
});

app.get("/impressum", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/impressum.html");
});

// Error Handeling

app.use(function (req, res) {
	res.status(200);
	res.sendFile(__dirname + "/public/html/404.html");
});