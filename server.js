const express = require("express");
const upload = require("express-fileupload");
const app = express();
const port = process.env.PORT || 3000;
const server = require("http").createServer(app);
app.use(require("body-parser").json({ limit: "1mb" }));
app.use(upload());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.get("/upload", (req, res) => {
	res.sendFile(__dirname + "/public/upload.html");
});

app.post("/uploadstatus", (req, res) => {
	if (req.files) {
		let file = req.files.file;
		let filename = file.name;

		file.mv("./Media/" + filename, function (err) {
			if (err) {
				res.status(500);
				res.send(err);
			} else {
				res.status(200);
				res.sendFile(__dirname + "/public/success.html");
			}
		});
	}
});

server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});
