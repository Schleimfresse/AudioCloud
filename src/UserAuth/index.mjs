let UserAuth = {};
import authRoutes from "./routes/auth.routes.mjs";
import userRoutes from "./routes/user.routes.mjs";
import middleware from "./middleware/index.mjs";
UserAuth.authRoutes = authRoutes;
UserAuth.userRoutes = userRoutes;
UserAuth.middleware = middleware;
export default UserAuth;
//# sourceMappingURL=index.mjs.map