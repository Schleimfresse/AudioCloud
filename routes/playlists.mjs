import express from "express";
import { database } from "../lib/lib.js";
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

export { router };
