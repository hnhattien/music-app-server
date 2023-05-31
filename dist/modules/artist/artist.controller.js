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
const prismaClient_1 = __importDefault(require("@core/database/prismaClient"));
const artist_service_1 = __importDefault(require("./artist.service"));
const RoleData_1 = require("@core/authenticate/RoleData");
const ErrorTypes_1 = require("@core/types/ErrorTypes");
const lodash_1 = require("lodash");
const getArtistForAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || user.role === RoleData_1.ROLE.ADMIN)
            throw new ErrorTypes_1.UnAuthenticated("Yout not permit to see artist infomation. Please login as admin.");
        const artists = yield artist_service_1.default.getArtistForAdmin();
        res.send(artists);
    }
    catch (err) {
        next(err);
    }
});
const getArtistAndMusicByArtistSlug = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { target } = req.params || {};
        if (!target) {
            throw new ErrorTypes_1.InputValidationError("Check your input");
        }
        const artistMusics = yield prismaClient_1.default.music.findMany({
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
            let customMusics = (0, lodash_1.map)(artistMusics, (music) => {
                var _a, _b, _c;
                return {
                    id: music.id,
                    upload_time: music.upload_time,
                    title: music.title,
                    artist_id: music.artist_id,
                    artist_name: music.artist_name,
                    music_thumbnail: music.thumbnail,
                    artist_thumbnail: (_a = music === null || music === void 0 ? void 0 : music.artist) === null || _a === void 0 ? void 0 : _a.thumbnail,
                    audio: music.audio,
                    music_slug: music.slug,
                    artist_slug: (_b = music === null || music === void 0 ? void 0 : music.artist) === null || _b === void 0 ? void 0 : _b.slug,
                    viewcount: music.viewcount,
                    lyrics: (_c = music.lyricTable) === null || _c === void 0 ? void 0 : _c.lyrics,
                };
            });
            const response = {
                artist_id: customMusics[0].artist_id,
                title: customMusics[0].artist_name,
                artist_slug: customMusics[0].artist_slug,
                artist_thumbnail: (_b = (_a = artistMusics[0]) === null || _a === void 0 ? void 0 : _a.artist) === null || _b === void 0 ? void 0 : _b.thumbnail,
            };
            res.send(response);
        }
        else {
            const artist = yield prismaClient_1.default.artist.findFirst({
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
            }
            else {
                res.send(new ErrorTypes_1.InputValidationError("No info about this artist"));
            }
        }
    }
    catch (err) {
        next(err);
    }
});
exports.default = {
    getArtistForAdmin,
    getArtistAndMusicByArtistSlug,
};
