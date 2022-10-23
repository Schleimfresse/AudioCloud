import lib from "../lib/lib.mjs";
let Libary = {};
export default Libary;
Libary.root = (req, res) => {
    lib.database.find({ type: "playlist" }, (err, data) => {
        if (err || data === null) {
            res.status(404);
            res.render(__dirname + "/public/views/error.ejs", {
                heading: "Not found",
                desc: "Check your request for spelling and syntax errors.",
            });
            return;
        }
        let recent = [];
        let playlists = [];
        data.forEach((playlist) => {
            playlists.push({ id: playlist.id, title: playlist.title, type: playlist.type });
        });
        lib.database.find({ recent_key: "recent" }, (err, data) => {
            if (err || data === null) {
                res.status(404);
                res.render(__dirname + "/public/views/error.ejs", {
                    heading: "Internal Server Error",
                    desc: "Server was not able to access the database, try again!",
                });
                return;
            }
            data.forEach((song) => {
                recent.push({
                    id: song.id,
                    thumbnail: song.thumbnail,
                    title: song.title,
                    type: song.type,
                    index: song.recent_order,
                });
            });
            recent.sort((a, b) => {
                return a.index - b.index;
            });
            res.status(200);
            console.log(recent);
            res.render(__dirname + "/public/views/library.ejs", {
                data: { playlists: JSON.stringify(playlists), recent: JSON.stringify(recent), user: req.user },
            });
        });
    });
};
//# sourceMappingURL=libary.mjs.map