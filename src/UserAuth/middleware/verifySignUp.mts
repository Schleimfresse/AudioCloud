import lib from "../Lib/lib.mjs";
const checkDuplicateUsernameOrEmail = (req, res, next) => {
	// Username
	lib.database.findOne(
		{
			username: req.body.username,
		},
		{},
		(err: Error, user: any) => {
			if (err) {
				res.status(500).send({ message: err });
				return;
			}

			if (user) {
				res.status(400).send({ message: "Failed! Username is already in use!", status: "error" });
				return;
			}
			// Email
			lib.database.findOne(
				{
					email: req.body.email,
				},
				{},
				(err, user) => {
					if (err) {
						res.status(500).send({ message: err, status: "error" });
						return;
					}

					if (user) {
						res.status(400).send({ message: "Failed! Email is already in use!", status: "error" });
						return;
					}
					next();
				}
			);
		}
	);
};

const checkRolesExisted = (req, res, next) => {
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
	next();
};

const verifySignUp = {
	checkDuplicateUsernameOrEmail,
	checkRolesExisted,
};

export { verifySignUp };
