import express from "express";
let router = express.Router();
import { database } from "../lib/lib.js";

router.get("/", (req, res) => {
	database.find({ type: "playlist" }, (err, data) => {
		if (err || data === null) {
			res.status(500);
			res.send("Data could not be accessed.");
			res.end();
			return;
		}
		let playlists = [];
		data.forEach((playlist) => {
			playlists.push({ name: playlist.name, title: playlist.title });
		});
		res.status(200);
		res.render(__dirname + "/public/views/libary.ejs", {
			data: { playlists: JSON.stringify(playlists) },
		});
	});
});

export { router };
