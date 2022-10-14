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
import { router as playerR } from "./routes/player.mjs";
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
app.use("/libary", libaryR);
app.use("/upload", uploadR);
app.use("/search", searchR);
app.use("/playlist", playlistR);
app.use("/player", playerR);
app.use("/api", Api);

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

// Error Handeling

app.use(function (req, res) {
	res.status(200);
	res.sendFile(__dirname + "/public/html/404.html")
});
