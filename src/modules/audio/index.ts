import { Application } from "express-serve-static-core";
import audioController from "./audio.controller";

const audioRoutes = (app: Application) => {
  app.get("/audio/:fileName", audioController.getAudio);
};

export default audioRoutes;
