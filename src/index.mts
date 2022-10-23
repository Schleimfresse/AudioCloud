let Routes: any = {}
import Delete from "./routes/delete.mjs";
import Edit from "./routes/edit.mjs";
import Libary from "./routes/library.mjs";
import Upload from "./routes/upload.mjs";
import Search from "./routes/search.mjs";
import Playlists from "./routes/playlists.mjs";
import Player from "./routes/player.mjs";
import History from "./routes/history.mjs";
import Api from "./routes/api.mjs";
import User from "./routes/user.mjs";
import Verify from "./routes/verify.mjs";

Routes.delete = Delete;
Routes.edit = Edit;
Routes.libary = Libary;
Routes.upload = Upload;
Routes.search = Search
Routes.playlists = Playlists;
Routes.player = Player;
Routes.history = History;
Routes.api = Api;
Routes.user = User;
Routes.verify = Verify;

export default Routes