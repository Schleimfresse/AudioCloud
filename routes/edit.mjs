import express from "express";
import { database } from "../lib/lib.js";
let router = express.Router();

router.get("/", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/edit.html");
});

router.get("/:id", (req, res) => {
	database.findOne({ id: req.params.id }, (err, data) => {
		if (err || data == null) {
			res.status(404);
			res.render(__dirname + "/public/views/error.ejs", {
				heading: "Not found",
				desc: "Check your request for spelling and syntax errors.",
			});
			return;
		}
		res.status(200);
		res.render(__dirname + "/public/views/edit_item.ejs", {
			title: data.title,
			desc: data.desc,
			artist: data.artist,
			name: data.name,
		});
	});
});

router.post("/:id/success", (req, res) => {
	try {
		database.update(
			{ name: req.params.id },
			{
				$set: req.body,
			}
		);
		res.status(200);
		res.sendFile(__dirname + "/public/html/success.html");
	} catch (err) {
		res.status(500);
		res.render(__dirname + "/public/views/error.ejs", {
			heading: "Internal Server Error",
			desc: "An Error occoured. Try again or check your request.",
		});
		return;
	}
});

export { router };
