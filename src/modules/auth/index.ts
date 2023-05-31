import { Application } from "express";
import authController from "./auth.controller";

const authRoutes = (app: Application) => {
  app.post("/auth/login", authController.login);
  app.post("/auth/signup", authController.signup);
  app.post("/auth/logout", authController.logout);
  app.post("/auth/signup", authController.loginFacebook);
  app.get("/auth/loginstatus", authController.checkLoginStatus);
};

export default authRoutes;
