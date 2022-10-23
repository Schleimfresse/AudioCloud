import middleware from "../middleware/index.mjs";
import controller from "../controller/auth.controller.mjs";
import express from "express";
let router = express.Router();

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
	next();
});

router.post(
	"/signup",
	[middleware.verifySignUp.checkDuplicateUsernameOrEmail, middleware.verifySignUp.checkRolesExisted],
	controller.signup.post
);

router.post("/signin", controller.signin.post);

router.get("/signout", controller.signout);

router.get("/signin", controller.signin.get)

router.get("/signup", controller.signup.get)

export default router;
