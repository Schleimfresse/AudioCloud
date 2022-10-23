import express from "express";
import Libary from "../controller/libary.mjs";
import UserAuth from "../UserAuth/index.mjs"
let router = express.Router();

router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Libary.root);

export default router;
