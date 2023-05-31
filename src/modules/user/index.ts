import { Application } from "express";
import userController from "./user.controller";
export const userRoutes = (app: Application) => {
  app.get("/users", userController.getUsers);
  app.get("/users/profile", userController.getProfile);
  app.get("/users/likedmusics", userController.getLikedMusics);
  app.post("/users/uploadavatar", userController.uploadAvatar);
  app.post("/users/changenickname", userController.changeNickName);
  app.post("/users/changepassword", userController.changePassword);
  app.post("/users/resetpassword", userController.resetPassword);
  app.post(
    "/users/authresetpassword",
    userController.authenticateResetPassword
  );
};
