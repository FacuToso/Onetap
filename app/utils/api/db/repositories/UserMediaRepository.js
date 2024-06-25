import prisma from 'utils/api/db/DB';

const getOne = async (userId, mediaType, mediaId, rest = null) => {
  const args = {
    where: {
      UserId: userId,
      MediaType: mediaType,
      MediaId: mediaId
    },
    ...rest,
  };

  return prisma.userMedia.findFirst(args);
};

const getByUserId = async (userId, extraWhere = null) => {
  const args = {
    where: {
      ...extraWhere,
      UserId: userId,
    },
  };

  return prisma.userMedia.findMany(args);
}

const createOne = async (userMedia) => {
  const args = {
    data: userMedia,
  };

  return prisma.userMedia.create(args);
};

const updateOne = async (userId, mediaType, mediaId, userMedia) => {
  const args = {
    where: {
      UserId_MediaType_MediaId: {
        UserId: userId,
        MediaType: mediaType,
        MediaId: mediaId
      },
    },
    data: userMedia,
  };

  return prisma.userMedia.update(args);
};

const deleteOne = async (userId, mediaType, mediaId) => {
  const args = {
    where: {
      UserId_MediaType_MediaId: {
        UserId: userId,
        MediaType: mediaType,
        MediaId: mediaId
      },
    },
  };

  return prisma.userMedia.delete(args);
};

export {
  getOne,
  getByUserId,
  createOne,
  updateOne,
  deleteOne,
};
