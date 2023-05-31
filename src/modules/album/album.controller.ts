import prismaClient from "@core/database/prismaClient";
import { NextFunction, Request, Response } from "express";
import albumService from "./album.service";

const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const albums = await albumService.getAlbums();
    res.send(albums);
  } catch (err) {
    next(err);
  }
};

export default {
  getAlbums,
};
