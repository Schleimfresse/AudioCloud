import express from "express";
import { searchHistory_Database, load_searchHistory_Database } from "../lib/lib.js";
let router = express.Router();

router.get("/", async (req, res) => {
	res.status(200);
	res.sendFile(__dirname + "/public/html/history.html");
});

router.post("/", async (req, res) => {
	let newElement = req.body;
	if (Object.keys(newElement).length === 0) return;
	newElement.date = Date.now();
	searchHistory_Database.find({}, (err, data) => {
		if (err || data === null || data == "") {
			res.status(404).render(__dirname + "/public/views/error.ejs", {
				heading: "Internal Server Error",
				desc: "Required resources could not be found",
			});
			return;
		}
		if (data.length > 100) {
			data.sort(function (a, b) {
				return b.date - a.date;
			});
			const lastObj = data.pop();
			searchHistory_Database.remove(lastObj, (err, number) => {
				if (err || data === null || data == "") {
					res.status(404).render(__dirname + "/public/views/error.ejs", {
						heading: "Internal Server Error",
						desc: "Could not perform required actions",
					});
					return;
				}
			});
		}
		const check = data.find((e) => e._id === newElement._id);
		if (check != undefined) {
			searchHistory_Database.update({ _id: check._id }, newElement, {}, (err, count) => {
				if (err || count < 0) {
					res.status(404).render(__dirname + "/public/views/error.ejs", {
						heading: "Internal Server Error",
						desc: "Could not perform required actions",
					});
					return;
				}
			});
		} else {
			searchHistory_Database.insert(newElement);
		}
		
	});
	load_searchHistory_Database;
});

export { router };
