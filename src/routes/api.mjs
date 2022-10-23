import express from "express";
import Api from "../controller/api.mjs";
let router = express.Router();
router.get("/", Api.root);
router.get("/tracks", Api.tracks);
router.get("/playlists", Api.playlists);
router.get("/history", Api.history);
router.get("/searchhistory/:id", Api.searchhistory);
export default router;
//# sourceMappingURL=api.mjs.map