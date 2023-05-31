"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("@core/config"));
const upload_client_1 = require("@uploadcare/upload-client");
const client = new upload_client_1.UploadClient({ publicKey: config_1.default.UPCARE_PUBLIC_KEY });
const upload = (filename, fileData) => {
    client
        .uploadFile(fileData, { fileName: filename })
        .then((file) => console.log(file.uuid));
};
exports.default = {
    upload,
};
