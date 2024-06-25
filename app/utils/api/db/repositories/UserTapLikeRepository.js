import prisma from 'utils/api/db/DB';

const getOne = async (userId, tapId, rest = null) => {
  const args = {
    where: {
      UserId: userId,
      TapId: tapId,
    },
    ...rest,
  };

  return prisma.userTapLike.findFirst(args);
};

const createOne = async (userTapLike) => {
  const args = {
    data: userTapLike,
  };

  return prisma.userTapLike.create(args);
};

const deleteOne = async (userId, tapId) => {
  const args = {
    where: {
      UserId_TapId: {
        UserId: userId,
        TapId: tapId,
      },
    },
  };

  return prisma.userTapLike.delete(args);
};

export {
  getOne,
  createOne,
  deleteOne,
};
