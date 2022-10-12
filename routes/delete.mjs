import express from "express";
import { database } from "../lib/lib.js";
import fs from "fs";
let router = express.Router();

router.get("/", (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/delete.html");
});

router.get("/m", (req, res) => {
	database.findOne({ id: req.query.v }, (err, data) => {
		if (err || data == null) {
			res.status(404);
			res.render(__dirname + "/public/views/error.ejs", {
				heading: "Not found",
				desc: "Check your request for spelling and syntax errors.",
			});
			return;
		}
		res.status(200);
		res.render(__dirname + "/public/views/delete_item.ejs", {
			title: data.title,
			id: data.id,
		});
	});
});

router.post("/:id/success", (req, res) => {
	try {
		database.findOne({ id: req.params.id }, (err, data) => {
			fs.rmSync(__dirname + `/public/Media/${data.name}`, {}, (err) => {
				if (err) {
					res.status(500);
					res.render(__dirname + "/public/views/error.ejs", {
						heading: "Internal Server Error",
						desc: "The requested resource could not be found. Try again or check your request.",
					});
					return;
				}
			});
			if (data.thumbnail !== "musical-notes-outline-gray.svg")
				fs.rmSync(__dirname + `/public/thumbnails/${data.thumbnail}`, {}, (err) => {
					if (err) {
						res.status(500);
						res.render(__dirname + "/public/views/error.ejs", {
							heading: "Internal Server Error",
							desc: "The requested resource could not be found. Try again or check your request.",
						});
						return;
					}
				});
		});
		database.remove({ id: req.params.id });
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
