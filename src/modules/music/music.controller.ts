import { ROLE } from "@core/authenticate/RoleData";
import prismaClient from "@core/database/prismaClient";
import { InputValidationError, UnAuthenticated } from "@core/types/ErrorTypes";
import { User } from "@prisma/client";
import imagekitUtil from "@utils/imagekit.util";
import uploadCareUtil from "@utils/uploadCare.util";
import { NextFunction, Request, Response } from "express";
import { toInteger } from "lodash";
import slugify from "slugify";
import { v4 } from "uuid";

const getMusicInfoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.params);
    const { id } = req.params || {};
    console.log(id, "Joi");
    if (!id) next("route");
    const user = req.session.user as Partial<User>;
    if (user) {
      const musicInfo = await prismaClient.music.findFirst({
        where: {
          id: toInteger(id),
        },
        include: {
          likes: {
            where: {
              songid: toInteger(id),
              userid: toInteger(user.id),
            },
          },
          lyricTable: true,
        },
      });
      res.send(musicInfo);
    } else {
      const musicInfo = await prismaClient.music.findFirst({
        where: {
          id: toInteger(id),
        },
        include: {
          lyricTable: true,
        },
      });
      res.send(musicInfo);
    }
  } catch (err) {
    next(err);
  }
};
const getMusicByQuery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const musics = await prismaClient.music.findMany({});
    res.send({ musics });
  } catch (err) {
    next(err);
  }
};
const searchMusic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { target } = req.params;
    if (target) {
      const musics = await prismaClient.music.findMany({
        where: {
          OR: [
            {
              title: {
                contains: target,
              },
            },
            {
              artist: {
                title: {
                  contains: target,
                },
              },
            },
            {
              slug: {
                contains: target,
              },
            },
            {
              artist: {
                slug: {
                  contains: target,
                },
              },
            },
          ],
        },
      });
      const artists = await prismaClient.artist.findMany({
        where: {
          title: {
            contains: target,
          },
        },
      });
      res.send({
        musics: musics,
        artists: artists,
      });
    } else {
      res.send([]);
    }
  } catch (err) {
    next(err);
  }
};
const updateView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body || {};
    if (id) {
      prismaClient.music.update({
        where: {
          id: toInteger(id),
        },
        data: {
          viewcount: {
            increment: 1,
          },
        },
      });
      res.send({ message: "Update view success" });
    } else {
      res.send(new InputValidationError("Please give a music id"));
    }
  } catch (err) {
    next(err);
  }
};

const getMusicInfoBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params || {};
    const user = req.session.user as Partial<User>;
    console.log(user);
    if (user) {
      console.log(slug);
      const musicInfo = await prismaClient.music.findFirst({
        where: {
          OR: [
            {
              slug: slug,
            },
            {
              id: toInteger(slug),
            },
          ],
        },
        include: {
          artist: true,
          likes: {
            where: {
              song: {
                slug,
              },
              userid: toInteger(user.id),
            },
          },
          lyricTable: true,
        },
      });
      res.send(musicInfo);
    } else {
      const musicInfo = await prismaClient.music.findFirst({
        where: {
          OR: [
            {
              slug: slug,
            },
            {
              id: toInteger(slug),
            },
          ],
        },
        include: {
          lyricTable: true,
          artist: true,
        },
      });
      res.send(musicInfo);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const postHeartActionToMusic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { songid } = req.body || {};
    const user = req.session.user as Partial<User>;
    if (user && user.id) {
      const affectedMusic = await prismaClient.music.findFirst({
        where: {
          id: toInteger(songid),
        },
      });
      const likedMusic = await prismaClient.likes.findFirst({
        where: {
          songid: toInteger(songid),
          userid: toInteger(user.id),
        },
      });
      if (likedMusic) {
        // Unlike
        await prismaClient.likes.delete({
          where: {
            id: likedMusic.id,
          },
        });

        res.send({ message: "Unliked", isLike: false, music: affectedMusic });
      } else {
        //Like
        await prismaClient.likes.create({
          data: {
            songid: toInteger(songid),
            userid: toInteger(user.id),
          },
        });
        res.send({ message: "Liked", isLike: false, music: affectedMusic });
      }
    } else {
      res.send({
        isRequireLogin: true,
        error: { message: "You must to login to perform this action." },
      });
    }
  } catch (err) {
    next(err);
  }
};
const uploadMusic = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.session.user as Partial<User>;
    if (user) {
      let songname = req.body.songname,
        artistname = req.body.artistname,
        category = toInteger(req.body.catid),
        songThumbnailFileBase64 = String(req.body.songThumbnailFileBase64)
          .split(";base64,")
          .pop(),
        songFileBase64 = String(req.body.songFileBase64)
          .split(";base64,")
          .pop();
      const slug = slugify(`${slugify(songname)}-${v4()}`);
      imagekitUtil.upload(slug, songThumbnailFileBase64 as string);
      uploadCareUtil.upload(slug, songFileBase64 as string);
      let artist_id: number | null = null;
      const artist = await prismaClient.artist.findFirst({
        where: {
          title: artistname,
        },
      });
      if (artist) artist_id = artist.id;
      else {
        const addedArtist = await prismaClient.artist.create({
          data: {
            title: artistname,
            slug: `${slugify(artistname)}-${v4()}`,
          },
        });

        artist_id = addedArtist.id;
      }
      await prismaClient.music.create({
        data: {
          title: songname,
          slug,
          artist_name: artistname,
          cat_id: category,
          thumbnail: slug,
          audio: slug,
          artist_id,
        },
      });
      res.send({ message: "Upload song success" });
    } else {
      res.send({
        error: {
          message: "You must to login to upload.",
          isRequireLogin: true,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

const getMusicsByCategorySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { catslug } = req.params || {};
    if (catslug) {
      const musics = await prismaClient.music.findMany({
        where: {
          cat: {
            slug: catslug,
          },
        },
        include: {
          cat: true,
          artist: true,
        },
      });
      res.send(musics);
    } else {
      res.send({ error: { message: "Invalid input" } });
    }
  } catch (err) {
    next(err);
  }
};

const getMusicsByAlbumSlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { albumslug } = req.params || {};
    if (albumslug) {
      const musics = await prismaClient.music.findMany({
        where: {
          OR: [
            {
              artist: {
                albums: {
                  some: {
                    slug: albumslug,
                  },
                },
              },
            },
            {},
          ],
        },
        include: {
          cat: true,
          artist: true,
        },
      });
      res.send(musics);
    } else {
      res.send({ error: { message: "Invalid input" } });
    }
  } catch (err) {
    next(err);
  }
};

const updateLyrics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.session.user as Partial<User>;
    const { songId, lyrics } = req.body || {};
    if (!user || user.role !== ROLE.ADMIN) {
      res.send({ error: { message: "You not permit perform this action" } });
    } else {
      if (songId) {
        await prismaClient.lyricTable.upsert({
          create: {
            lyrics,
            songid: toInteger(songId),
            userid: toInteger(user.id),
          },
          update: {
            lyrics,
            songid: toInteger(songId),
            userid: toInteger(user.id),
          },
          where: {
            songid: toInteger(songId),
          },
        });
        res.send({ message: "Update lyrics success" });
      } else {
        res.send({ error: { message: "You must to provide a song id. " } });
      }
    }
  } catch (err) {
    res.send({ error: { message: String(err) } });
  }
};

export default {
  getMusicInfoById,
  searchMusic,
  updateView,
  getMusicInfoBySlug,
  postHeartActionToMusic,
  getMusicsByAlbumSlug,
  uploadMusic,
  getMusicsByCategorySlug,
  updateLyrics,
  getMusicByQuery,
};
