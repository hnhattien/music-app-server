import { Application } from "express";
import userController from "./user.controller";
export const userRoutes = (app: Application) => {
  app.get("/user", userController.getUsers);
  app.get("/user/:id", userController.getUserById);
  app.get("/user/likedmusics", userController.getLikedMusics);
  app.post("/user/uploadavatar", userController.uploadAvatar);
  app.post("/user/changenickname", userController.changeNickName);
  app.post("/user/changepassword", userController.changePassword);
  app.get("/user/resetpassword", userController.resetPassword);
  app.get("/user/authresetpassword", userController.authenticateResetPassword);
};
