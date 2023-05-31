import prismaClient from "@core/database/prismaClient";
import { NextFunction, Request, Response } from "express";
import artistService from "./artist.service";
import { ROLE } from "@core/authenticate/RoleData";
import { User } from "@prisma/client";
import { InputValidationError, UnAuthenticated } from "@core/types/ErrorTypes";
import { map } from "lodash";

const getArtistForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as Partial<User>;
    if (!user || user.role === ROLE.ADMIN)
      throw new UnAuthenticated(
        "Yout not permit to see artist infomation. Please login as admin."
      );

    const artists = await artistService.getArtistForAdmin();
    res.send(artists);
  } catch (err) {
    next(err);
  }
};

const getArtistAndMusicByArtistSlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { target } = req.params || {};
    if (!target) {
      throw new InputValidationError("Check your input");
    }
    const artistMusics = await prismaClient.music.findMany({
      where: {
        artist: {
          slug: target,
        },
      },
      include: {
        lyricTable: true,
        artist: true,
      },
    });

    if (artistMusics.length > 0) {
      let customMusics = map(artistMusics, (music) => {
        return {
          id: music.id,
          upload_time: music.upload_time,
          title: music.title,
          artist_id: music.artist_id,
          artist_name: music.artist_name,
          music_thumbnail: music.thumbnail,
          artist_thumbnail: music?.artist?.thumbnail,
          audio: music.audio,
          music_slug: music.slug,
          artist_slug: music?.artist?.slug,
          viewcount: music.viewcount,
          lyrics: music.lyricTable?.lyrics,
        };
      });
      const response = {
        artist_id: customMusics[0].artist_id,
        title: customMusics[0].artist_name,
        artist_slug: customMusics[0].artist_slug,
        artist_thumbnail: artistMusics[0]?.artist?.thumbnail,
      };
      res.send(response);
    } else {
      const artist = await prismaClient.artist.findFirst({
        where: {
          slug: target,
        },
      });
      if (artist) {
        const response = {
          artist_id: artist.id,
          title: artist.title,
          artist_slug: artist.slug,
          artist_thumbnail: artist.thumbnail,
        };
        res.send(response);
      } else {
        res.send(new InputValidationError("No info about this artist"));
      }
    }
  } catch (err) {
    next(err);
  }
};

export default {
  getArtistForAdmin,
  getArtistAndMusicByArtistSlug,
};
