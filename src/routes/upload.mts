import express from "express";
import Upload from "../controller/upload.mjs";
let router = express.Router();

router.get("/", Upload.uploadPage);

router.post("/", Upload.uploadFile);

export default router;
