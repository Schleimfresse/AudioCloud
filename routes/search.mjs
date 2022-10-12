import express from "express";
import * as Lib from "../lib/lib.js";
let router = express.Router();

router.get("/", (req, res) => {
	if (req.query.query != "" || req.query.mode != "" || req.query.type != "") {
		if (req.query.type != "search" && req.query.type != "edit" && req.query.type != "delete") {
			res.status(404);
			res.render(__dirname + "/public/views/error.ejs", {
				heading: "Bad request",
				desc: `The file type ${req.query.type} is invalid, check your request and try again`,
			});
			return;
		}
		if (req.query.mode != "strict" && req.query.mode != "standard") {
			res.status(404);
			res.render(__dirname + "/public/views/error.ejs", {
				heading: "Bad request",
				desc: `The search type (mode), ${req.query.mode}, is invalid, check your request and try again`,
			});
			return;
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
			});
		});
	} else {
		res.render(__dirname + `/public/views/${req.query.type}.ejs`, {
			data: JSON.stringify(""),
		});
	}
});

export { router };
