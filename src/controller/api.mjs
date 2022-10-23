import lib from "../lib/lib.mjs";
let Api = {};
export default Api;
Api.root = (req, res) => {
    lib.database.find({}, (err, data) => {
        if (err) {
            res.status(500);
            res.send("<h1>500 Internal Server Error</h1>");
            res.end();
            return;
        }
        res.json(data);
    });
};
Api.tracks = (req, res) => {
    lib.database.find({ type: "track" }, (err, data) => {
        if (err) {
            res.status(500);
            res.send("<h1>500 Internal Server Error</h1>");
            res.end();
            return;
        }
        res.json(data);
    });
};
Api.playlists = (req, res) => {
    lib.database.find({ type: "playlist" }, (err, data) => {
        if (err) {
            res.status(500);
            res.send("<h1>500 Internal Server Error</h1>");
            res.end();
            return;
        }
        res.json(data);
    });
};
Api.history = (req, res) => {
    lib.history_Database.find({}, (err, data) => {
        if (err) {
            res.status(500);
            res.send("<h1>500 Internal Server Error</h1>");
            res.end();
            return;
        }
        res.json(data);
    });
};
Api.searchhistory = (req, res) => {
    lib.searchhistory_database.findOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500);
            res.send("<h1>500 Internal Server Error</h1>");
            res.end();
            return;
        }
        res.json(data);
    });
};
//# sourceMappingURL=api.mjs.map