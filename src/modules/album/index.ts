import { Application } from "express";
import albumController from "./album.controller";
export const albumRoutes = (app: Application) => {
  app.get("/album", albumController.getAlbums);
};
