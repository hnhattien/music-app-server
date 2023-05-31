"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const album_1 = require("@modules/album");
const artist_1 = require("@modules/artist");
const category_1 = require("@modules/category");
const music_1 = require("@modules/music");
const user_1 = require("@modules/user");
const routes = (app) => {
    (0, user_1.userRoutes)(app);
    (0, artist_1.artistRoutes)(app);
    (0, music_1.musicRoutes)(app);
    (0, category_1.categoryRoutes)(app);
    (0, album_1.albumRoutes)(app);
};
exports.default = routes;
