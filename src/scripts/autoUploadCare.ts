import config from "@core/config";
import prismaClient from "@core/database/prismaClient";
import { UploadClient } from "@uploadcare/upload-client";
import { readFileSync, readdir } from "fs";
import path from "path";

const client = new UploadClient({ publicKey: config.UPCARE_PUBLIC_KEY });
const PATH = "/home/sunwarder/audio/";
readdir(PATH, async (err, files) => {
  if (files.length) {
    console.log(files);
    for (let i = 0; i < files.length; i++) {
      try {
        const filePath = `${PATH}${files[i]}`;
        const fileData = readFileSync(filePath);
        const result = await client.uploadFile(fileData, {
          fileName: files[i],
        });
        console.log(result.cdnUrl);
        const fileName = path.basename(filePath);

        await prismaClient.music.updateMany({
          where: {
            audio: fileName,
          },
          data: {
            cdnAudioUrl: result.cdnUrl as string,
          },
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
});
