import * as fs from "fs";
import uniqid from "uniqid";
import lib from "../lib/lib.mjs";
import * as path from "path";
import { fileTypeFromFile } from "file-type";
import jsmediatags from "jsmediatags";
let Upload = {};
export default Upload;
Upload.uploadFile = async (req, res) => {
    if (req.files || req.body.title != "") {
        let file = req.files.file;
        let thumbnail = req.files.thumbnail;
        let thumbnail_autocreate = true;
        let img_ext = ".png";
        let ext = path.extname(file.name);
        let uniqid_inst = uniqid();
        let filename = uniqid_inst + ext;
        let thumbnail_name = uniqid_inst;
        let description = lib.replaceURLs(req.body.desc);
        let artist = req.body.artist;
        if (!file.mimetype.includes("audio/")) {
            if (!file.mimetype.includes("video/")) {
                res.status(400);
                res.render(__dirname + "/public/views/error.ejs", {
                    heading: "Bad request",
                    desc: `The file type ${req.files.file.mimetype} is invalid, check your request and try again`,
                });
                return;
            }
        }
        file.mv(__dirname + `/public/assets/media/${filename}`, async function (err) {
            let metadata = await lib.getMetadata(filename);
            console.log("metadata", metadata);
            if (thumbnail !== undefined) {
                img_ext = path.extname(thumbnail.name);
                if (thumbnail.mimetype.includes("image/")) {
                    thumbnail_autocreate = false;
                    thumbnail.mv(__dirname + `/public/assets/images/${thumbnail_name + img_ext}`, async (err) => {
                        if (err) {
                            res.status(500).render(__dirname + "/public/views/error.ejs", {
                                heading: "Internal Server Error",
                                desc: "An error occurred while trying to write the thumbnail image file.",
                            });
                            return;
                        }
                    });
                }
                else {
                    res.status(400);
                    res.render(__dirname + "/public/views/error.ejs", {
                        heading: "Bad request",
                        desc: `The image type ${req.files.thumbnail.mimetype} is invalid, check your request and try again`,
                    });
                    return;
                }
            }
            else if (thumbnail == undefined) {
                jsmediatags.read(__dirname + `/public/assets/media/${filename}`, {
                    onSuccess: async function (tag) {
                        console.log(tag);
                        let image = tag.tags.picture;
                        if (image) {
                            thumbnail_autocreate = false;
                            let Img_Buffer = Buffer.from(image.data);
                            fs.writeFile(__dirname + `/public/assets/images/${thumbnail_name + img_ext}`, Img_Buffer, (err) => {
                                if (!err)
                                    console.log("Image data written");
                            });
                        }
                        else {
                            if (file.mimetype.includes("video/") && thumbnail_autocreate == true) {
                                lib.createThumbnail(metadata, thumbnail_name, filename);
                            }
                            else {
                                thumbnail_autocreate = false;
                                thumbnail_name = lib.STANDARD_THUMBNAIL;
                                img_ext = lib.STANDARD_THUMBNAIL_EXT;
                            }
                        }
                    },
                    onError: async function () {
                        if (file.mimetype.includes("video/") && thumbnail_autocreate == true) {
                            lib.createThumbnail(metadata, thumbnail_name, filename);
                        }
                        else {
                            thumbnail_autocreate = false;
                            thumbnail_name = lib.STANDARD_THUMBNAIL;
                            img_ext = lib.STANDARD_THUMBNAIL_EXT;
                        }
                    },
                });
            }
            if (err) {
                res.status(500);
                res.render(__dirname + "/public/views/error.ejs", {
                    heading: "Internal Server Error",
                    desc: "An error occurred while trying to write the thumbnail image file.",
                });
                return;
            }
            else {
                const date = new Date();
                const Db_duration = lib.formatDuration(metadata.duration);
                const type = await fileTypeFromFile(__dirname + "/public/assets/media/" + filename);
                const added_date = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
                if (filename === null ||
                    req.body.title.toLowerCase() === null ||
                    type === null ||
                    added_date === null ||
                    Db_duration === null) {
                    res.status(500);
                    res.render(__dirname + "/public/views/error.ejs", {
                        heading: "Internal Server Error",
                        desc: "Some metadata for the video file could not be generated or is not specified.",
                    });
                    return;
                }
                if (metadata.tags != undefined) {
                    if (req.body.desc == "" && metadata.tags.description != undefined) {
                        description = metadata.tags.description;
                    }
                    if (req.body.artist == "" && metadata.tags.artist != undefined) {
                        artist = metadata.tags.artist;
                    }
                }
                lib.database.insert({
                    name: filename,
                    searchquery: req.body.title.toLowerCase(),
                    type: "track",
                    desc: description,
                    artist: artist,
                    title: req.body.title,
                    mime: type,
                    added: added_date,
                    thumbnail: thumbnail_name + img_ext,
                    id: uniqid_inst,
                    str_duration: Db_duration,
                    int_duration: Math.round(metadata.duration),
                }, (err) => {
                    if (err) {
                        res.status(500);
                        res.render(__dirname + "/public/views/error.ejs", {
                            heading: "Internal Server Error",
                            desc: "An error occurred while trying to write the thumbnail image file.",
                        });
                        return;
                    }
                });
                res.status(200);
                res.sendFile(__dirname + "/public/html/success.html");
            }
        });
    }
    else {
        res.status(400);
        res.render(__dirname + "/public/views/error.ejs", {
            heading: "Bad request",
            desc: `Invalid request, either no file could be identified or the form was not filled out sufficiently. Try again!`,
        });
        return;
    }
};
Upload.uploadPage = (req, res) => {
    res.status(200);
    res.sendFile(__dirname + "/public/html/upload.html");
};
//# sourceMappingURL=upload.mjs.map