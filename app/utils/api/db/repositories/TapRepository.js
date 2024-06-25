import prisma from 'utils/api/db/DB';

const feedOptions = {
  include: {
    User: true,
    UserTapLikes: {
      include: {
        User: true,
      },
    },
    TapRespondingTo: {
      include: {
        User: true,
        TapResponses: true,
        UserTapLikes: {
          include: {
            User: true,
          },
        },
      }
    },
    TapResponses: {
      include: {
        User: true,
        TapResponses: true,
        UserTapLikes: {
          include: {
            User: true,
          },
        },
      },
      orderBy: {
        CreateDate: 'asc',
      }
    },
  },
  orderBy: {
    CreateDate: 'desc',
  }
}

const getOne = async (tapId, rest = null) => {
  const args = {
    where: {
      TapId: tapId,
    },
    include: {
      User: true,
      UserTapLikes: {
        include: {
          User: true,
        },
      },
      TapRespondingTo: {
        include: {
          User: true,
          TapResponses: true,
          UserTapLikes: {
            include: {
              User: true,
            },
          },
        }
      },
      TapResponses: {
        include: {
          User: true,
          TapResponses: true,
          UserTapLikes: {
            include: {
              User: true,
            },
          },
        },
        orderBy: {
          CreateDate: 'asc',
        }
      },
    },
    ...rest,
  };

  return prisma.tap.findFirst(args);
};

const getAll = async (options) => {
  const args = {
    ...options,
  };

  return prisma.tap.findMany(args);
};

const getNotLoggedInFeed = async () => {
  const args = {
    ...feedOptions
  };

  return prisma.tap.findMany(args);
};

const getUserFeed = async (userId) => {
  const args = {
    where: {
      OR: [
        {
          UserId: userId, // taps created by received user
        },
        {
          User: {
            Followers: {
              some: {
                UserId: userId, // taps created by users that are followed by received user
              },
            },
          },
        },
      ]
    },
    ...feedOptions
  };

  return prisma.tap.findMany(args);
};

const createOne = async (tap) => {
  const args = {
    data: tap,
  };

  return prisma.tap.create(args);
};

const updateOne = async (tapId, tap) => {
  const args = {
    where: {
      TapId: tapId,
    },
    data: tap,
  };

  return prisma.tap.update(args);
};

const deleteOne = async (tapId) => {
  const args = {
    where: {
      TapId: tapId,
    },
  };

  return prisma.tap.delete(args);
};

export {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
  getNotLoggedInFeed,
  getUserFeed,
};
