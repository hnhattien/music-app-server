import { Application } from "express";
import artistController from "./artist.controller";
export const artistRoutes = (app: Application) => {
  app.get("/artist/artistinfo", artistController.getArtistForAdmin);
  app.get("/artist/:target", artistController.getArtistAndMusicByArtistSlug);
};
