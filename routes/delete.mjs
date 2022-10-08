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
			res.status(500);
			res.sendFile(__dirname + "/public/html/notfound.html")
			res.end();
			return;
		}
		res.status(200);
		res.render(__dirname + "/public/views/delete_item.ejs", {
			data: JSON.stringify(data),
		});
	});
});

router.post("/:id/success", (req, res) => {
	try {
		database.findOne({ id: req.params.id }, (err, data) => {
			fs.rmSync(__dirname + `/public/Media/${data.name}`, {}, (err) => {
				if (err) {
					res.status(500);
					res.send("<h1>500 Internal Server Error</h1><p>file could not be found.</p>");
				}
			});
			if (!data.thumbnail === 'musical-notes-outline-gray.svg')
				fs.rmSync(__dirname + `/public/thumbnails/${data.thumbnail}`, {}, (err) => {
					if (err) {
						res.status(500);
						res.send("<h1>500 Internal Server Error</h1><p>file could not be found.</p>");
					}
				});
		});
		database.remove({ id: req.params.id });
		res.status(200);
		res.sendFile(__dirname + "/public/html/success.html");
	} catch (err) {
		res.status(500);
		res.send("<h1>500 Internal Server Error</h1>");
	}
});

export { router };
