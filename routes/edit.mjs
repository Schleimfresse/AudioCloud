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
			res.status(500);
			res.send("Data could not be accessed.");
			res.end();
			return;
		}
		console.log(data);
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
		console.log(req.body);
		res.status(200);
		res.sendFile(__dirname + "/public/html/success.html");
	} catch (err) {
		res.status(500);
		res.send("<h1>500 Internal Server Error</h1>");
	}
});

export { router };
