import lib from "../lib/lib.mjs";
import * as fs from "fs";
let Delete: any = {};
export default Delete;

Delete.root = (req, res) => {
	res.status(200);
	res.render(__dirname + "/public/views/delete.ejs");
};

Delete.medium = (req, res) => {
	lib.database.findOne({ id: req.query.v }, (err, data) => {
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
			data: {user: req.user},
		});
	});
};

Delete.success = (req, res) => {
	try {
		lib.database.findOne({ id: req.params.id }, (err, data) => {
			fs.rm(__dirname + `/public/assets/media/${data.name}`, async (err: any) => {
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
				fs.rm(__dirname + `/public/assets/images/${data.thumbnail}`, async (err) => {
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
		lib.database.remove({ id: req.params.id });
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
};
