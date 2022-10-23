import express from "express";
import Search from "../controller/search.mjs";
import UserAuth from "../UserAuth/index.mjs"
let router = express.Router();

router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Search.root);

router.post("/history", Search.history);

router.post("/history/delete", Search.historydelete);

router.post("/history/deleteall", Search.historydeleteall);

export default router;
