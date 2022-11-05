import jwt from "jsonwebtoken";
import config from "../config/auth.config.mjs";
import lib from "../lib/lib.mjs";

/**
 * Verifies the tokens the diffrence to the `verifyTokenSoft` function is that if no token is provided the requested page will be blocked and can not be accessed
 * @param req express request
 * @param res express response
 * @param next express next
 */
const verifyToken = (req, res, next) => {
	let token = req.session.token;
	if (!token) {
		return res.status(403).render(__dirname + "/public/views/auth.ejs", {
			heading: "You are not logged in",
			desc: "You can access this page only if you are logged in",
			type: "Login",
			link: "auth/signin",
		});
	}

	jwt.verify(token, config, (err, decoded) => {
		if (err) {
			return res.status(401).render(__dirname + "/public/views/auth.ejs", {
				heading: "Unauthorized!",
				desc: "Token could not be found",
				type: "Home",
				link: "",
			});
		}
		req.userId = decoded.id;
		console.log("req.userId:", req.userId);
	});
	next();
};

/**
 * Verifies the tokens the diffrence to the `verifyToken` function is that if no token is provided you still can access the requested page
 * @param req express request
 * @param res express response
 * @param next express next
 */
const verifyTokenSoft = (req, res, next) => {
	console.log("SOFT");
	let token = req.session.token;
	if (!token) {
		req.userId = "";
		console.log("SOFT no token");
		next();
	}
	if (token) {
		jwt.verify(token, config, (err, decoded) => {
			if (err) {
				req.userId = "";
				return res
					.status(401)
					.render(__dirname + "/public/views/auth.ejs", {
						heading: "Expired!",
						desc: "Your token expired click below to login",
						type: "Login",
						link: "auth/signin",
					})
			} else {
				req.userId = decoded.id;
				console.log("req.userId:", req.userId);
				next();
			}
		});
	}
};

/**
 * Sets the current logged in user to the req.user variable so the information can be accessed on the client
 * @param req express response
 * @param res express response
 * @param next express next
 */
const setUser = (req, res, next) => {
	lib.database.loadDatabase();
	lib.database.findOne({ _id: req.userId }, {}, (err: Error, user: any) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		if (user === null) {
			req.user = { username: "", status: { text: "Log in", svg: "login", route: "signin" } };
		} else {
			req.user = user;
			req.user.status = { text: "Log out", svg: "logout", route: "signout" };
		}
		next();
	});
};

const isAdmin = (req, res, next) => {
	lib.database.findOne({ _id: req.userId }, {}, (err: Error, user: any) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		for (const role of user.roles) {
			if (role === "admin") {
				next();
				return;
			}
		}
		res.status(403).send({ message: "Require Admin Role!" });
	});
};

const isModerator = (req, res, next) => {
	lib.database.findOne({ _id: req.userId }, {}, (err: Error, user) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}
		for (const role of user.roles) {
			if (role === "moderator") {
				next();
				return;
			}
		}
		res.status(403).send({ message: "Require Moderator Role!" });
	});
};

const authJwt = {
	verifyToken,
	verifyTokenSoft,
	setUser,
	isAdmin,
	isModerator,
};
export { authJwt };
