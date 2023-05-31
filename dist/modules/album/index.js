"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.albumRoutes = void 0;
const album_controller_1 = __importDefault(require("./album.controller"));
const albumRoutes = (app) => {
    app.get("/album", album_controller_1.default.getAlbums);
};
exports.albumRoutes = albumRoutes;
