import { Application } from "express";
import musicController from "./music.controller";
export const musicRoutes = (app: Application) => {
  app.get("/song", musicController.getMusicByQuery);
  app.get("/index", musicController.getMusicByQuery);
  app.get("/song/:slug", musicController.getMusicInfoBySlug);
  app.get("/search/:target", musicController.searchMusic);
  app.post("/song/updateview", musicController.updateView);
  app.post("/song/updatelyrics", musicController.updateLyrics);
  app.post("/song/heartaction", musicController.postHeartActionToMusic);
  app.post("/song/upload", musicController.uploadMusic);
  app.get("/song/category/:catslug", musicController.getMusicsByCategorySlug);
  app.get("/song/album/:albumslug", musicController.getMusicsByAlbumSlug);
};
