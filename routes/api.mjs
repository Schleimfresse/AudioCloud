import express from "express";
import { database, searchHistory_Database } from "../lib/lib.js";
let router = express.Router();

router.get("/", (req, res) => {
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

router.get("/tracks", (req, res) => {
	database.find({ type: "track" }, (err, data) => {
		if (err) {
			res.status(500);
			res.send("<h1>500 Internal Server Error</h1>");
			res.end();
			return;
		}
		res.json(data);
	});
});

router.get("/playlists", (req, res) => {
	database.find({ type: "playlist" }, (err, data) => {
		if (err) {
			res.status(500);
			res.send("<h1>500 Internal Server Error</h1>");
			res.end();
			return;
		}
		res.json(data);
	});
});

router.get("/history", (req, res) => {
	searchHistory_Database.find({}, (err, data) => {
		if (err) {
			res.status(500);
			res.send("<h1>500 Internal Server Error</h1>");
			res.end();
			return;
		}
		res.json(data);
	});
});

export { router };
