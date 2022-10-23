import middleware from "../middleware/index.mjs";
import controller from "../controller/user.controller.mjs";
import express from "express";
let router = express.Router();

router.use(function (req, res, next) {
	res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
	next();
});

router.get("/all", controller.allAccess);

router.get("/user", [middleware.authJwt.verifyToken], controller.userBoard);

router.get(
	"/mod",
	[middleware.authJwt.verifyToken, middleware.authJwt.isModerator],
	controller.moderatorBoard
);

router.get("/admin", [middleware.authJwt.verifyToken, middleware.authJwt.isAdmin], controller.adminBoard);

export default router;
