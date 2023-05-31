import prismaClient from "@core/database/prismaClient";

const getAlbums = async () => {
  return await prismaClient.album.findMany({});
};

export default {
  getAlbums,
};
