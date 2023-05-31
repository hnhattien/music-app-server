"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenHelper = exports.accessTokenHelper = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const config_1 = __importDefault(require("../core/config"));
let { JWT_ACCESS_TOKEN_PRIVATE_KEY, JWT_REFRESH_TOKEN_PRIVATE_KEY } = config_1.default || {};
const signAccessToken = (payload, expiresIn) => {
    return (0, jsonwebtoken_1.sign)(payload, JWT_ACCESS_TOKEN_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: expiresIn,
    });
};
const signRefreshToken = (payload, expiresIn) => {
    return (0, jsonwebtoken_1.sign)(payload, JWT_REFRESH_TOKEN_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: expiresIn,
    });
};
const issueAccessToken = (sub, sessionId, expiresIn) => {
    return signAccessToken({
        sub,
        jti: sessionId,
    }, expiresIn);
};
const issueRefreshToken = (sub, sessionId, expiresIn) => {
    return signRefreshToken({
        sub,
        jti: sessionId,
    }, expiresIn);
};
const verifyRefreshToken = (token) => {
    try {
        const tokenDetail = (0, jsonwebtoken_1.verify)(token, JWT_REFRESH_TOKEN_PRIVATE_KEY, {
            algorithms: ["RS256"],
        });
        const { jti, sub } = tokenDetail || {};
        return {
            sessionId: jti,
            id: sub,
        };
    }
    catch (error) {
        throw new Error("No authenticated");
    }
};
const verifyAccessToken = (token) => {
    try {
        const tokenDetail = (0, jsonwebtoken_1.verify)(token, JWT_ACCESS_TOKEN_PRIVATE_KEY, {
            algorithms: ["RS256"],
        });
        const { jti, sub } = tokenDetail || {};
        return {
            sessionId: jti,
            id: sub,
        };
    }
    catch (error) {
        console.log(error);
        throw new Error("No authenticated");
    }
};
const accessTokenHelper = {
    signAccessToken,
    verifyAccessToken,
    issueAccessToken,
};
exports.accessTokenHelper = accessTokenHelper;
const refreshTokenHelper = {
    signRefreshToken,
    verifyRefreshToken,
    issueRefreshToken,
};
exports.refreshTokenHelper = refreshTokenHelper;
