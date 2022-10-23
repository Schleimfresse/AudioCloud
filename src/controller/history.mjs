import lib from "../lib/lib.mjs";
let History = {};
export default History;
History.root = (req, res) => {
    res.status(200);
    res.render(__dirname + "/public/views/history.ejs", {
        data: { user: req.user },
    });
};
History.add = (req, res) => {
    let newElement = req.body;
    if (Object.keys(newElement).length === 0)
        return;
    newElement.date = Date.now();
    lib.history_Database.find({}, (err, data) => {
        if (err) {
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
            lib.history_Database.remove(lastObj, (err, number) => {
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
            lib.history_Database.update({ _id: check._id }, newElement, {}, (err, count) => {
                if (err || count < 0) {
                    res.status(404).render(__dirname + "/public/views/error.ejs", {
                        heading: "Internal Server Error",
                        desc: "Could not perform required actions",
                    });
                    return;
                }
            });
        }
        else {
            lib.history_Database.insert(newElement);
        }
    });
    lib.history_Database.loadDatabase();
};
//# sourceMappingURL=history.mjs.map