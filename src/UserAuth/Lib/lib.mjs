import Datastore from "nedb";
const database = new Datastore("user.db");
database;
database.loadDatabase();
const ROLES = ["user", "admin", "moderator"];
const STANDARD_AVATAR = "standard.svg";
export default {
    database,
    ROLES,
    STANDARD_AVATAR,
};
//# sourceMappingURL=lib.mjs.map