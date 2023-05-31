import { albumRoutes } from "@modules/album";
import { artistRoutes } from "@modules/artist";
import audioRoutes from "@modules/audio";
import authRoutes from "@modules/auth";
import { categoryRoutes } from "@modules/category";
import { musicRoutes } from "@modules/music";
import { userRoutes } from "@modules/user";
import { Application } from "express";

const routes = (app: Application) => {
  userRoutes(app);
  artistRoutes(app);
  musicRoutes(app);
  categoryRoutes(app);
  albumRoutes(app);
  audioRoutes(app);
  authRoutes(app);
};

export default routes;
