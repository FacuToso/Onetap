import prisma from 'utils/api/db/DB';

const getOne = async (userId, followingUserId, rest = null) => {
  const args = {
    where: {
      UserId: userId,
      FollowingUserId: followingUserId,
    },
    ...rest,
  };

  return prisma.userFollow.findFirst(args);
};

const createOne = async (userFollow) => {
  const args = {
    data: userFollow,
  };

  return prisma.userFollow.create(args);
};

const deleteOne = async (userId, followingUserId) => {
  const args = {
    where: {
      UserId_FollowingUserId: {
        UserId: userId,
        FollowingUserId: followingUserId,
      },
    },
  };

  return prisma.userFollow.delete(args);

};

export {
  getOne,
  createOne,
  deleteOne,
};
