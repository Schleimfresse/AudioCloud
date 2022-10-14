import express from "express";
import { database } from "../lib/lib.js";
let router = express.Router();

router.get("/", (request, res) => {
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

router.get("/tracks", (request, res) => {
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

router.get("/playlists", (request, res) => {
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

export { router };
