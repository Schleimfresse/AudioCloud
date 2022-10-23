import express from "express";
import Delete from "../controller/delete.mjs";
import UserAuth from "../UserAuth/index.mjs";
let router = express.Router();
router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Delete.root);
router.get("/m", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], Delete.medium);
router.post("/:id/success", Delete.success);
export default router;
//# sourceMappingURL=delete.mjs.map