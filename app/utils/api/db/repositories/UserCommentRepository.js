import prisma from 'utils/api/db/DB';

const getOne = async (userCommentId) => {
  const args = {
    where: {
      UserCommentId: userCommentId,
    },
  };

  return prisma.userComment.findFirst(args);
};

const getMediaComments = async (mediaId, type) => {
  const args = {
    where: {
      MediaId: mediaId,
      MediaType: type,
    },
    include: {
      User: true,
    },
    orderBy: {
      CreateDate: 'asc',
    }
  };

  return prisma.userComment.findMany(args);
};

const createOne = async (userComment) => {
  const args = {
    data: userComment,
  };

  return prisma.userComment.create(args);
};

const deleteOne = async (userCommentId) => {
  const args = {
    where: {
      UserCommentId: userCommentId,
    },
  };

  return prisma.userComment.delete(args);
};


export {
  getOne,
  getMediaComments,
  createOne,
  deleteOne,
}