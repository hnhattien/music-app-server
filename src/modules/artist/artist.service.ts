import prismaClient from "@core/database/prismaClient";

const getArtistForAdmin = async () => {
  return await prismaClient.artist.findMany({
    orderBy: {
      adddate: "desc",
    },
  });
};
export default {
  getArtistForAdmin,
};
