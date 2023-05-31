import dotenv from "dotenv";
import ImageKit from "imagekit";
import config from "src/core/config";
dotenv.config();
var imagekit = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

const upload = async (fileName: string, base64: string) => {
  const res = await imagekit.upload({
    file: base64,
    fileName: fileName,
    useUniqueFileName: false,
    overwriteFile: true,
    folder: "chat_app",
  });
  return res;
};
const getExtFromBase64 = async (base64Data: string) => {
  return base64Data.substring(
    "data:image/".length,
    base64Data.indexOf(";base64")
  );
};

export default {
  upload,
  imagekit,
  getExtFromBase64,
};
