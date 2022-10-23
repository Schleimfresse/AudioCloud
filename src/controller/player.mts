import lib from "../lib/lib.mjs";
let Player: any = {};
export default Player;

Player.root = (req, res) => {
	if (req.query.list) {
		lib.database.findOne({ id: req.query.list }, (err, data) => {
			if (err || data === null || data == "") {
				res.status(404);
				res.render(__dirname + "/public/views/error.ejs", {
					heading: "Not found",
					desc: "Check your request for spelling and syntax errors.",
				});
				return;
			}
			let track = data.tracks.find((e) => e.id == req.query.v);
			let tracks = data.tracks;
			if (tracks == undefined || track === undefined) {
				res.redirect(`/playlist?list=${req.query.list}`);
				return;
			}
			res.status(200);
			res.render(__dirname + "/public/views/player.ejs", {
				data: { medium: track.name, info: JSON.stringify(tracks), user: req.user },
			});
		});
	} else if (req.query.v) {
		lib.database.find({ id: req.query.v }, (err, data) => {
			if (err || data === null || data == "") {
				res.status(404);
				res.render(__dirname + "/public/views/error.ejs", {
					heading: "Not found",
					desc: "Check your request for spelling and syntax errors.",
				});
				return;
			}
			lib.updateRecentActivity(JSON.stringify(req.query.v), res);
			data = data.shift();
			res.status(200);
			res.render(__dirname + "/public/views/player.ejs", {
				data: { medium: data.name, info: JSON.stringify(data), user: req.user, },
			});
		});
	}
};
