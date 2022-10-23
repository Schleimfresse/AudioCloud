import lib from "../lib/lib.mjs";
let Edit: any  = {};
export default Edit;

Edit.root = (req, res) => {
	res.status(200);
	res.render(__dirname + "/public/views/edit.ejs", {
		data: {user: req.user},
	});
};

Edit.id = (req, res) => {
	lib.database.findOne({ id: req.params.id }, (err, data) => {
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
			data: {user: req.user},
		});
	});
};

Edit.success = (req, res) => {
	try {
		lib.database.update(
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
};
