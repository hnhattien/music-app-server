import { albumRoutes } from "@modules/album";
import { artistRoutes } from "@modules/artist";
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
};

export default routes;
