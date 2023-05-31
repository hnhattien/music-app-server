"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const user_controller_1 = __importDefault(require("./user.controller"));
const userRoutes = (app) => {
    app.get("/user", user_controller_1.default.getUsers);
    app.get("/user/:id", user_controller_1.default.getUserById);
    app.get("/user/likedmusics", user_controller_1.default.getLikedMusics);
    app.post("/user/uploadavatar", user_controller_1.default.uploadAvatar);
    app.post("/user/changenickname", user_controller_1.default.changeNickName);
    app.post("/user/changepassword", user_controller_1.default.changePassword);
    app.get("/user/resetpassword", user_controller_1.default.resetPassword);
    app.get("/user/authresetpassword", user_controller_1.default.authenticateResetPassword);
};
exports.userRoutes = userRoutes;
