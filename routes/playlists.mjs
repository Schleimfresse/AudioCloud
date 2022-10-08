import express from "express";
import { database, formatDuration } from "../lib/lib.js";
import uniqid from "uniqid";

let router = express.Router();

router.post("/create", (req, res) => {
	if (Object.keys(req.body).length === 0) return;
	console.log(req.body);
	let uniqid_inst = uniqid();
	database.insert(
		{
			name: uniqid_inst,
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
				res.send("<h1>500 Internal Server Error</h1>");
				return;
			}
			res.send({ title: req.body.title, desc: req.body.description, name: uniqid_inst });
		}
	);
});

router.get("/", (req, res) => {
	database.findOne({ name: req.query.list }, (err, data) => {
		if (err || data === null || data == "") {
			res.status(500);
			res.sendFile(__dirname + "/public/html/notfound.html")
			res.end();
			return;
		}
		console.log(data.tracks[0].id);
		res.render(__dirname + "/public/views/playlist.ejs", {
			playlist: JSON.stringify(data),
			name: data.name,
			title: data.title,
			thumbnail: data.thumbnail,
			duration: formatDuration(data.totalduration),
			amount: data.amount,
			firsttrack: data.tracks[0].id,
		});
	});
});

router.post("/add", (req, res) => {
	database.findOne({ id: req.body.id }, (err, track) => {
		if (err || track === null || track == "") {
			res.status(500);
			res.send({ message: "An Error ocured!" });
			res.end();
			return;
		}
		database.findOne({ name: req.body.playlist }, (err, data) => {
			if (err || data === null || data == "") {
				res.status(500);
				res.send({ message: "An Error ocured!" });
				res.end();
				return;
			}
			const check = data.tracks.find((e) => e.id == req.body.id);
			if (check) {
				res.status(200).send({ message: "The track is already in the playlist!" });
				res.end();
				return;
			}
			database.update(
				{ name: req.body.playlist },
				{ $inc: { totalduration: track.int_duration }, $inc: { amount: 1 }, $push: { tracks: track } },
				(err, data) => {
					if (err || data === null || data == "") {
						res.status(500);
						res.send({ message: "An Error ocured!" });
						res.end();
						return;
					}
					res.send({ message: "Track was successfully added!" });
				}
			);
		});
	});
});

export { router };
