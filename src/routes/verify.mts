import express from "express";
import Verify from "../controller/verify.mjs";
import UserAuth from "../UserAuth/index.mjs"
let router = express.Router();

router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Verify.root);

router.post("/",[UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Verify.post)

router.post("/activate", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Verify.activate)

export default router;
