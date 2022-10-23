// Initialisation
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
global.__dirname = __dirname;
lib.ffmpegInstaller;
lib.ffmpegprobe;
lib.ffmpeg;
import express from "express";
import upload from "express-fileupload";
import cookieSession from "cookie-session";
import cors from "cors";
import * as path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
import http from "http";
const server = http.createServer(app);
import lib from "./src/lib/lib.mjs";
import UserAuth from "./src/UserAuth/index.mjs";
import Routes from "./src/index.mjs";
const corsOptions = {
    origin: "http://localhost:3000",
};
// Middleware
app.use(cookieSession({
    name: "AudioCloud-session",
    keys: ["key1", "key2"],
    secret: process.env.secretKey,
    httpOnly: true,
}));
//app.use(favicon())
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload(undefined));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views/"));
// Routes
app.use("/delete", Routes.delete);
app.use("/edit", Routes.edit);
app.use("/library", Routes.libary);
app.use("/upload", Routes.upload);
app.use("/search", Routes.search);
app.use("/playlist", Routes.playlists);
app.use("/player", Routes.player);
app.use("/history", Routes.history);
app.use("/api", Routes.api);
app.use("/profile", Routes.user);
app.use("/verify", Routes.verify);
app.use("/auth", UserAuth.authRoutes);
app.use("/test", UserAuth.userRoutes);
// Database
lib.database;
lib.database.loadDatabase();
lib.code_database;
lib.code_database.loadDatabase();
lib.history_Database;
lib.history_Database.loadDatabase();
lib.searchhistory_database;
// Server
server.listen(port, () => {
    console.log(`app listening at Port: ${port}`);
});
app.get("/", [UserAuth.middleware.authJwt.verifyTokenSoft, UserAuth.middleware.authJwt.setUser], (req, res) => {
    res.status(200);
    res.render(__dirname + "/public/views/index.ejs", {
        data: { user: req.user },
    });
});
app.get("/privacy", (req, res) => {
    res.status(200);
    res.sendFile(__dirname + "/public/html/privacy.html");
});
app.get("/impressum", (req, res) => {
    res.status(200);
    res.sendFile(__dirname + "/public/html/impressum.html");
});
// Error Handeling
app.use(function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/public/html/404.html");
});
//# sourceMappingURL=server.mjs.map