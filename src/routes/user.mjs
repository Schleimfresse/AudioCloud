import express from "express";
import User from "../controller/user.mjs";
import UserAuth from "../UserAuth/index.mjs";
let router = express.Router();
router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next();
});
router.get("/", [UserAuth.middleware.authJwt.verifyToken, UserAuth.middleware.authJwt.setUser], User.root);
router.post("/", [UserAuth.middleware.authJwt.verifyToken], User.post); /* comment out through dev */
export default router;
//# sourceMappingURL=user.mjs.map