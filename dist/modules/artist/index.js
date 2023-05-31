"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistRoutes = void 0;
const artist_controller_1 = __importDefault(require("./artist.controller"));
const artistRoutes = (app) => {
    app.get("/artist/artistinfo", artist_controller_1.default.getArtistForAdmin);
    app.get("/artist/:target", artist_controller_1.default.getArtistAndMusicByArtistSlug);
};
exports.artistRoutes = artistRoutes;
