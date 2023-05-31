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
const dotenv_1 = __importDefault(require("dotenv"));
const imagekit_1 = __importDefault(require("imagekit"));
const config_1 = __importDefault(require("src/core/config"));
dotenv_1.default.config();
var imagekit = new imagekit_1.default({
    publicKey: config_1.default.IMAGEKIT_PUBLIC_KEY,
    privateKey: config_1.default.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config_1.default.IMAGEKIT_URL_ENDPOINT,
});
const upload = (fileName, base64) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield imagekit.upload({
        file: base64,
        fileName: fileName,
        useUniqueFileName: false,
        overwriteFile: true,
        folder: "chat_app",
    });
    return res;
});
const getExtFromBase64 = (base64Data) => __awaiter(void 0, void 0, void 0, function* () {
    return base64Data.substring("data:image/".length, base64Data.indexOf(";base64"));
});
exports.default = {
    upload,
    imagekit,
    getExtFromBase64,
};
