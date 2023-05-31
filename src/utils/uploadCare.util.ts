import config from "@core/config";
import { UploadClient } from "@uploadcare/upload-client";

const client = new UploadClient({ publicKey: config.UPCARE_PUBLIC_KEY });

const upload = (filename: string, fileData: string) => {
  client
    .uploadFile(fileData, { fileName: filename })
    .then((file) => console.log(file.uuid));
};

export default {
  upload,
};
