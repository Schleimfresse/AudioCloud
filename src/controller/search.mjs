import lib from "../lib/lib.mjs";
let Search = {};
export default Search;
Search.root = (req, res) => {
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
        lib.database.find({}, (err, data) => {
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
            }
            else if (req.query.mode == "strict") {
                data.forEach((e) => {
                    if (e.searchquery.includes(searchquery) && e.mime.mime.includes(req.query.mediatype)) {
                        filtered.push(e);
                    }
                });
            }
            res.status(200);
            console.log(req.user);
            res.render(__dirname + `/public/views/${req.query.type}.ejs`, {
                data: JSON.stringify(filtered),
                user: req.user,
            });
        });
    }
    else {
        res.render(__dirname + `/public/views/${req.query.type}.ejs`, {
            data: JSON.stringify(""),
            user: req.user,
        });
    }
};
Search.history = (req, res) => {
    const data = req.body;
    console.log(data);
    lib.searchhistory_database.loadDatabase();
    lib.searchhistory_database.findOne({ _id: data.user }, {}, (err, user_history) => {
        console.log(user_history);
        if (user_history !== null) {
            console.log("trigger", user_history != null);
            user_history.history.forEach((e) => {
                if (e.value.toLowerCase() === data.data.value.toLowerCase()) {
                    lib.searchhistory_database.update({ _id: data.user }, { $pull: { history: { value: e.value } } });
                }
            });
        }
        if (user_history == null || user_history == "") {
            lib.searchhistory_database.insert({ _id: data.user, history: [data.data] });
        }
        else {
            console.log(user_history.history.length);
            if (user_history.history.length >= 8) {
                lib.searchhistory_database.update({ _id: data.user }, { $pop: { history: -1 } }, {}, (err, count) => {
                    if (err || count == 0) {
                        res.status(500).send({
                            message: "An error occurred while trying to update the database",
                        });
                        return;
                    }
                });
            }
            lib.searchhistory_database.update({ _id: data.user }, { $push: { history: data.data } }, {}, (err, count) => {
                if (err) {
                    if (err || data === null || count == 0) {
                        res.status(500).send({
                            message: "An error occurred while trying to update the database",
                        });
                        return;
                    }
                }
            });
        }
    });
    lib.searchhistory_database.loadDatabase();
};
Search.historydelete = (req, res) => {
    lib.searchhistory_database.loadDatabase();
    lib.searchhistory_database.update({ _id: req.body.user }, { $pull: { history: { value: req.body.value } } });
    lib.searchhistory_database.loadDatabase();
};
Search.historydeleteall = (req, res) => {
    console.log("historydeleteall", req.body);
    lib.searchhistory_database.loadDatabase();
    lib.searchhistory_database.remove({ _id: req.body.user }, {}, (err, count) => {
        if (err) {
            res.status(500).send({ message: "An error occured, your search history could not be deleted!" });
            return;
        }
        lib.searchhistory_database.loadDatabase();
        res.status(200).send({ message: "Your search history was deleted!" });
    });
};
//# sourceMappingURL=search.mjs.map