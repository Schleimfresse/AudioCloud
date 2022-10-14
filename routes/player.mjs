import express from "express";
import { database, updateRecentActivity } from "../lib/lib.js";

let router = express.Router();

router.get("/", (req, res) => {
	if (req.query.list) {
		database.findOne({ name: req.query.list }, (err, data) => {
			if (err || data === null || data == "") {
				res.status(404);
				res.render(__dirname + "/public/views/error.ejs", {
					heading: "Not found",
					desc: "Check your request for spelling and syntax errors.",
				});
				return;
			}
			let track = data.tracks.find((e) => e.id == req.query.v);
			let tracks = data.tracks;
			if (tracks == undefined || track === undefined) {
				res.redirect(`/playlist?list=${req.query.list}`);
				return;
			}
			res.status(200);
			res.render(__dirname + "/public/views/player.ejs", {
				data: { medium: track.name, info: JSON.stringify(tracks) },
			});
		});
	} else if (req.query.v) {
		database.find({ id: req.query.v }, (err, data) => {
			if (err || data === null || data == "") {
				res.status(404);
				res.render(__dirname + "/public/views/error.ejs", {
					heading: "Not found",
					desc: "Check your request for spelling and syntax errors.",
				});
				return;
			}
			updateRecentActivity(JSON.stringify(req.query.v), res);
			data = data.shift();
			res.status(200);
			res.render(__dirname + "/public/views/player.ejs", {
				data: { medium: data.name, info: JSON.stringify(data) },
			});
		});
	}
});

export { router };
