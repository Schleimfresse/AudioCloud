import express from "express";
import Player from "../controller/player.mjs";
import UserAuth from "../UserAuth/index.mjs"
let router = express.Router();

router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Player.root);

export default router;
