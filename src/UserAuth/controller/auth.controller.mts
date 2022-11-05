import config from "../config/auth.config.mjs";
import lib from "../lib/lib.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

let signup: any = {};

signup.post = (req, res) => {
	console.log(req.body);
	const user = {
		username: req.body.username,
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, 8),
		roles: ["user"],
		img: lib.STANDARD_AVATAR,
		tfa: false,
	};
	console.log(user);
	lib.database.insert(user, (err, data) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		lib.database.loadDatabase();
		signin.post(req, res)

	});
};

signup.get = (req, res) => {
	res.sendFile(__dirname + "/public/html/signup.html");
};

let signin: any = {};
(signin.post = (req, res) => {
	lib.database.findOne(
		{
			username: req.body.username,
		},
		(err, user) => {
			if (err) {
				res.status(500).send({ message: err });
			}

			if (!user) {
				return res.status(401).send({
					accessToken: null,
					status: "error",
					heading: "Invalid combination!",
					desc: "Your username, password combination was not correct, try again!",
				});
			}

			const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) {
				return res.status(401).send({
					accessToken: null,
					status: "error",
					heading: "Invalid combination!",
					desc: "Your username, password combination was not correct, try again!",
				});
			}

			const token = jwt.sign({ id: user._id }, config, {
				expiresIn: 86400, // 24 hours
			});
			let authorities: Array<string> = [];

			for (let i = 0; i < user.roles.length; i++) {
				authorities.push("ROLE_" + user.roles[i].toUpperCase());
			}
			req.user = user;
			req.session.token = token;
			console.log(req.user);
			res.status(200).send({
				status: "success",
				heading: "Success",
				desc: `You have been successfully signed in as ${user.username}`,
			});
		}
	);
}),
	(signin.get = (req, res) => {
		res.sendFile(__dirname + "/public/html/signin.html");
	});

const signout = async (req, res) => {
	try {
		req.session = null;
		return res.status(200).render(__dirname + "/public/views/auth.ejs", {
			heading: "Success",
			desc: "You have been signed out successfully!",
			type: "Home",
			link: "",
		});
	} catch (err) {
		this.next(err);
	}
};

export default { signup, signin, signout };
