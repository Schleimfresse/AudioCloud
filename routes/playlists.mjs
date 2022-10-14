import express from "express";
import { database, formatDuration } from "../lib/lib.js";
import uniqid from "uniqid";
import { updateRecentActivity } from "../lib/lib.js";
let router = express.Router();

router.post("/create", (req, res) => {
	if (Object.keys(req.body).length === 0) return;
	console.log(req.body);
	let uniqid_inst = uniqid();
	database.insert(
		{
			id: uniqid_inst,
			type: "playlist",
			title: req.body.title,
			desc: req.body.description,
			searchquery: req.body.title.toLowerCase(),
			thumbnail: "playlist-thumbnail.svg",
			totalduration: 0,
			amount: 0,
			tracks: [],
		},
		(err, data) => {
			if (err) {
				res.status(500);
				res.render(__dirname + "/public/views/error.ejs", {
					heading: "Internal Server Error",
					desc: "An error occurred while trying to access the database, try sending your request again.",
				});
				return;
			}
			res.send({ title: req.body.title, desc: req.body.description, name: uniqid_inst });
		}
	);
});

router.get("/", (req, res) => {
	database.findOne({ id: req.query.list }, (err, data) => {
		if (err || data === null || data == "") {
			res.status(404);
			res.render(__dirname + "/public/views/error.ejs", {
				heading: "Not found",
				desc: "The requested resource could not be found, check your request and try again!",
			});
			return;
		}
		updateRecentActivity(JSON.stringify(req.query.list), res);
		let firsttrack;
		if (data.tracks.length > 1) {
			firsttrack = data.tracks[0].id;
		}
		res.render(__dirname + "/public/views/playlist.ejs", {
			playlist: JSON.stringify(data),
			name: data.id,
			title: data.title,
			thumbnail: data.thumbnail,
			duration: formatDuration(data.totalduration),
			amount: data.amount,
			firsttrack: firsttrack,
		});
	});
});

router.post("/add", (req, res) => {
	database.findOne({ id: req.body.id }, (err, track) => {
		if (err || track === null || track == "") {
			res.status(404);
			res.render(__dirname + "/public/views/error.ejs", {
				heading: "Not found",
				desc: "A required resource could not be retrieved, try resending your request.",
			});
			return;
		}
		database.findOne({ id: req.body.playlist }, (err, data) => {
			if (err || data === null || data == "") {
				res.status(404);
				res.render(__dirname + "/public/views/error.ejs", {
					heading: "Not found",
					desc: "The requested resource could not be found, check your request and try again!",
				});
				return;
			}
			const check = data.tracks.find((e) => e.id == req.body.id);
			if (check) {
				res.status(200).send({ message: "The track is already in the playlist!" });
				res.end();
				return;
			}
			database.update(
				{ id: req.body.playlist },
				{ $push: { tracks: track }, $inc: { amount: 1, totalduration: track.int_duration } },
				{},
				(err, data) => {
					if (err || data === null || data == "") {
						res.status(500);
						res.render(__dirname + "/public/views/error.ejs", {
							heading: "Internal Server Error",
							desc: "An error occurred while trying to update the database, try sending your request again.",
						});
						return;
					}
					res.send({ message: "Track was successfully added!" });
				}
			);
		});
	});
});

export { router };
