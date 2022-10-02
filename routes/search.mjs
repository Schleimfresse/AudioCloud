import express from "express";
import * as Lib from "../lib/lib.js";
let router = express.Router();

router.get("/", (req, res) => {
	if (req.query.query != "" || req.query.mode != "" || req.query.type != "") {
		if (req.query.type != "search" && req.query.type != "edit" && req.query.type != "delete") {
			res.status(400);
			res.send(`<h1>400 Bad request</h1> Searchtype ${req.query.type} does not exist`);
			res.end();
		}
		let searchquery = req.query.query.toLowerCase();
		let searchquery_letters = searchquery.split("");
		Lib.database.find({}, (err, data) => {
			let filtered = [];
			if (req.query.mode == "standard") {
				let i = 0;
				data.forEach((e) => {
					for (let letter of searchquery_letters) {
						if (e.searchquery.includes(letter)) {
							i++;
						}
					}
					if (i === searchquery_letters.length) {
						filtered.push(e);
					}
					i = 0;
				});
			} else if (req.query.mode == "strict") {
				data.forEach((e) => {
					if (e.searchquery.includes(searchquery) && e.mime.mime.includes(req.query.mediatype)) {
						filtered.push(e);
					}
				});
			}
			res.status(200);
			res.render(__dirname + `/public/views/${req.query.type}.ejs`, {
				data: JSON.stringify(filtered),
				server_query: JSON.stringify(req.query.query),
			});
		});
	} else {
		res.render(__dirname + `/public/views/${req.query.type}.ejs`, {
			data: JSON.stringify(""),
			server_query: JSON.stringify(""),
		});
	}
});

export { router };