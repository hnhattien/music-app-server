"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_middleware_1 = require("./jwt.middleware");
exports.default = {
    authenticate: jwt_middleware_1.authenticate,
};
