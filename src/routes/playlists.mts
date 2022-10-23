import express from "express";
import Playlists from "../controller/playlists.mjs";
import UserAuth from "../UserAuth/index.mjs"
let router = express.Router();

router.post("/create", Playlists.create);

router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Playlists.root);

router.post("/add", Playlists.add);

export default router;