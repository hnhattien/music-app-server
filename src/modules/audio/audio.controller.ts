import dropboxClient from "@core/dropbox/uploadCareClient";
import { NextFunction, Request, Response } from "express";

const getAudio = async (req: Request, res: Response, next: NextFunction) => {
  const { fileName } = req.params;
  const result = await dropboxClient.filesSearch({
    query: fileName,
    mode: {
      ".tag": "filename",
    },
    path: "music_app",
  });
  res.send(result);
};

export default {
  getAudio,
};
