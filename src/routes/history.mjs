import express from "express";
import History from "../controller/history.mjs";
import UserAuth from "../UserAuth/index.mjs";
let router = express.Router();
router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], History.root);
router.post("/", History.add);
export default router;
//# sourceMappingURL=history.mjs.map