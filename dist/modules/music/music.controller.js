"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RoleData_1 = require("@core/authenticate/RoleData");
const prismaClient_1 = __importDefault(require("@core/database/prismaClient"));
const ErrorTypes_1 = require("@core/types/ErrorTypes");
const imagekit_util_1 = __importDefault(require("@utils/imagekit.util"));
const uploadCare_util_1 = __importDefault(require("@utils/uploadCare.util"));
const lodash_1 = require("lodash");
const slugify_1 = __importDefault(require("slugify"));
const uuid_1 = require("uuid");
const getMusicInfoById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params || {};
        if (!id)
            next("route");
        const user = req.user;
        if (user) {
            const musicInfo = yield prismaClient_1.default.music.findFirst({
                where: {
                    id: (0, lodash_1.toInteger)(id),
                },
                include: {
                    likes: {
                        where: {
                            songid: (0, lodash_1.toInteger)(id),
                            userid: (0, lodash_1.toInteger)(user.id),
                        },
                    },
                    lyricTable: true,
                },
            });
            res.send(musicInfo);
        }
        else {
            const musicInfo = yield prismaClient_1.default.music.findFirst({
                where: {
                    id: (0, lodash_1.toInteger)(id),
                },
                include: {
                    lyricTable: true,
                },
            });
            res.send(musicInfo);
        }
    }
    catch (err) {
        next(err);
    }
});
const getMusicByQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const musics = yield prismaClient_1.default.music.findMany({});
        res.send({ musics });
    }
    catch (err) {
        next(err);
    }
});
const searchMusic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { target } = req.params;
        if (target) {
            const musics = yield prismaClient_1.default.music.findMany({
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
            res.send(musics);
        }
        else {
            res.send([]);
        }
    }
    catch (err) {
        next(err);
    }
});
const updateView = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body || {};
        if (id) {
            prismaClient_1.default.music.update({
                where: {
                    id: (0, lodash_1.toInteger)(id),
                },
                data: {
                    viewcount: {
                        increment: 1,
                    },
                },
            });
            res.send({ message: "Update view success" });
        }
        else {
            res.send(new ErrorTypes_1.InputValidationError("Please give a music id"));
        }
    }
    catch (err) {
        next(err);
    }
});
const getMusicInfoBySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params || {};
        if (!slug)
            next("route");
        const user = req.user;
        if (user) {
            const musicInfo = yield prismaClient_1.default.music.findFirst({
                where: {
                    slug: slug,
                },
                include: {
                    likes: {
                        where: {
                            song: {
                                slug,
                            },
                            userid: (0, lodash_1.toInteger)(user.id),
                        },
                    },
                    lyricTable: true,
                },
            });
            res.send(musicInfo);
        }
        else {
            const musicInfo = yield prismaClient_1.default.music.findFirst({
                where: {
                    slug,
                },
                include: {
                    lyricTable: true,
                },
            });
            res.send(musicInfo);
        }
    }
    catch (err) {
        next(err);
    }
});
const postHeartActionToMusic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songid, userid } = req.body || {};
        const user = req.user;
        if (user) {
            const affectedMusic = yield prismaClient_1.default.music.findFirst({
                where: {
                    id: (0, lodash_1.toInteger)(songid),
                },
            });
            const likedMusic = yield prismaClient_1.default.likes.findFirst({
                where: {
                    songid: (0, lodash_1.toInteger)(songid),
                    userid: (0, lodash_1.toInteger)(userid),
                },
            });
            if (likedMusic) {
                // Unlike
                yield prismaClient_1.default.likes.delete({
                    where: {
                        id: likedMusic.id,
                    },
                });
                res.send({ message: "Unliked", isLike: false, music: affectedMusic });
            }
            else {
                //Like
                yield prismaClient_1.default.likes.create({
                    data: {
                        songid: (0, lodash_1.toInteger)(songid),
                        userid: (0, lodash_1.toInteger)(userid),
                    },
                });
                res.send({ message: "Liked", isLike: false, music: affectedMusic });
            }
        }
        else {
            res.send({
                isRequireLogin: true,
                error: { message: "You must to login to perform this action." },
            });
        }
    }
    catch (err) {
        next(err);
    }
});
const uploadMusic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            let songname = req.body.songname, artistname = req.body.artistname, category = (0, lodash_1.toInteger)(req.body.catid), songThumbnailFileBase64 = String(req.body.songThumbnailFileBase64)
                .split(";base64,")
                .pop(), songFileBase64 = String(req.body.songFileBase64)
                .split(";base64,")
                .pop();
            const slug = (0, slugify_1.default)(`${(0, slugify_1.default)(songname)}-${(0, uuid_1.v4)()}`);
            imagekit_util_1.default.upload(slug, songThumbnailFileBase64);
            uploadCare_util_1.default.upload(slug, songFileBase64);
            let artist_id = null;
            const artist = yield prismaClient_1.default.artist.findFirst({
                where: {
                    title: artistname,
                },
            });
            if (artist)
                artist_id = artist.id;
            else {
                const addedArtist = yield prismaClient_1.default.artist.create({
                    data: {
                        title: artistname,
                        slug: `${(0, slugify_1.default)(artistname)}-${(0, uuid_1.v4)()}`,
                    },
                });
                artist_id = addedArtist.id;
            }
            yield prismaClient_1.default.music.create({
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
        }
        else {
            res.send({
                error: {
                    message: "You must to login to upload.",
                    isRequireLogin: true,
                },
            });
        }
    }
    catch (err) {
        next(err);
    }
});
const getMusicsByCategorySlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { catslug } = req.params || {};
        if (catslug) {
            const musics = yield prismaClient_1.default.music.findMany({
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
        }
        else {
            res.send({ error: { message: "Invalid input" } });
        }
    }
    catch (err) {
        next(err);
    }
});
const getMusicsByAlbumSlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { albumslug } = req.params || {};
        if (albumslug) {
            const musics = yield prismaClient_1.default.music.findMany({
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
        }
        else {
            res.send({ error: { message: "Invalid input" } });
        }
    }
    catch (err) {
        next(err);
    }
});
const updateLyrics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { songId, lyrics } = req.body || {};
        if (!user || user.role !== RoleData_1.ROLE.ADMIN) {
            res.send({ error: { message: "You not permit perform this action" } });
        }
        else {
            if (songId) {
                yield prismaClient_1.default.lyricTable.upsert({
                    create: {
                        lyrics,
                        songid: (0, lodash_1.toInteger)(songId),
                        userid: (0, lodash_1.toInteger)(user.id),
                    },
                    update: {
                        lyrics,
                        songid: (0, lodash_1.toInteger)(songId),
                        userid: (0, lodash_1.toInteger)(user.id),
                    },
                    where: {
                        songid: (0, lodash_1.toInteger)(songId),
                    },
                });
                res.send({ message: "Update lyrics success" });
            }
            else {
                res.send({ error: { message: "You must to provide a song id. " } });
            }
        }
    }
    catch (err) {
        res.send({ error: { message: String(err) } });
    }
});
exports.default = {
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
