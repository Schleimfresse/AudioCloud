import lib from "../UserAuth/Lib/lib.mjs";
let User = {};
export default User;
User.root = (req, res) => {
    res.status(200);
    console.log(req.user, req.userId);
    res.render(__dirname + "/public/views/user.ejs", {
        data: { user: req.user },
    });
};
User.post = (req, res) => {
    console.log(req.body);
    lib.database.loadDatabase();
    lib.database.findOne({ _id: req.body._id }, (err, data) => {
    });
    lib.database.update({ _id: req.body._id }, { $set: { email: req.body.email, username: req.body.username } }, {}, (err, count) => {
        console.log(count);
        if (err) {
            res.status(500).send({ message: "Error, could not save changes!", status: "error" });
            return;
        }
        res.send({ message: "Successfully applied changes!", status: "success" });
    });
};
//# sourceMappingURL=user.mjs.map