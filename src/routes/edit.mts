import express from "express";
import Edit from "../controller/edit.mjs";
import UserAuth from "../UserAuth/index.mjs"
let router = express.Router();

router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Edit.root);

router.get("/:id", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Edit.id);

router.post("/:id/success", Edit.success);

export default router;
