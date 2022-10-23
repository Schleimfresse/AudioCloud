import lib from "../lib/lib.mjs";
const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    console.log("trigger 1");
    lib.database.findOne({
        username: req.body.username,
    }, {}, (err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!", status: "error" });
            return;
        }
        console.log("trigger 2");
        // Email
        lib.database.findOne({
            email: req.body.email,
        }, {}, (err, user) => {
            if (err) {
                res.status(500).send({ message: err, status: "error" });
                return;
            }
            if (user) {
                res.status(400).send({ message: "Failed! Email is already in use!", status: "error" });
                return;
            }
            console.log("trigger 3", user);
            next();
        });
    });
};
const checkRolesExisted = (req, res, next) => {
    console.log("trigger 4");
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!lib.ROLES.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`,
                });
                return;
            }
        }
    }
    console.log("trigger 5");
    next();
};
const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
};
export { verifySignUp };
//# sourceMappingURL=verifySignUp.mjs.map