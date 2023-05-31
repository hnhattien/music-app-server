"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicRoutes = void 0;
const music_controller_1 = __importDefault(require("./music.controller"));
const musicRoutes = (app) => {
    app.get("/song", music_controller_1.default.getMusicByQuery);
    app.get("/index", music_controller_1.default.getMusicByQuery);
    app.get("/song/:id", music_controller_1.default.getMusicInfoById);
    app.get("/song/:slug", music_controller_1.default.getMusicInfoBySlug);
    app.get("/song/search/:target", music_controller_1.default.searchMusic);
    app.post("/song/updateview", music_controller_1.default.updateView);
    app.post("/song/updatelyrics", music_controller_1.default.updateLyrics);
    app.post("/song/heartaction", music_controller_1.default.postHeartActionToMusic);
    app.post("/song/upload", music_controller_1.default.uploadMusic);
    app.get("/song/category/:catslug", music_controller_1.default.getMusicsByCategorySlug);
    app.get("/song/album/:albumslug", music_controller_1.default.getMusicsByAlbumSlug);
};
exports.musicRoutes = musicRoutes;
