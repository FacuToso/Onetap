import prisma from 'utils/api/db/DB';

const getAll = async (options) => {
  const args = {
    ...options,
  };

  return prisma.user.findMany(args);
};

const getOne = async (login, rest = null) => {
  const args = {
    where: {
      Login: login,
    },
    ...rest,
  };

  return prisma.user.findFirst(args);
};

const getOneById = async (id, rest = null) => {
  const args = {
    where: {
      UserId: id,
    },
    ...rest,
  };

  return prisma.user.findFirst(args);
};

const getOneByIdWithFullData = async (id) => {
  const args = {
    where: {
      UserId: id,
    },
    include: {
      Taps: {
        include: {
          User: true,
          TapResponses: true,
          TapRespondingTo: {
            include: {
              User: true,
            },
          },
          UserTapLikes: {
            include: {
              User: true,
            },
          },
        },
        orderBy: {
          CreateDate: 'desc',
        },
      },
      UserTapLikes: {
        include: {
          Tap: {
            include: {
              User: true,
              TapResponses: true,
              UserTapLikes: {
                include: {
                  User: true,
                },
              },
            },
          }
        },
        orderBy: {
          Tap: {
            CreateDate: 'desc',
          }
        }
      },
      Followers: {
        include: {
          User: true,
        },
      },
      UsersFollowing: {
        include: {
          FollowingUser: true,
        },
      },
      UserSocialProfileSections: {
        include: {
          SocialProfileSection: true,
        },
        orderBy: {
          SocialProfileSection: {
            Order: 'asc',
          },
        },
      },
    },
  };

  return prisma.user.findFirst(args);
};

const search = async (searchText) => {
  const args = {
    where: {
      Login: {
        contains: searchText,
      },
    },
  };

  return prisma.user.findMany(args);
};

const createOne = async (user) => {
  const args = {
    data: user,
  };

  return prisma.user.create(args);
};

const updateOne = async (login, user) => {
  const args = {
    where: {
      Login: login,
    },
    data: user,
  };

  return prisma.user.update(args);
};

const updateConfig = async (userId, user, userProfileSections) => {
  const args = {
    where: {
      UserId: userId,
    },
    data: {
      ...user,
      UserSocialProfileSections: {
        deleteMany: {},
        /*
        TODO: we are currently deleting all profile sections and creating them from scratch. Check if we can create the ones that aren't related yet, and therefore avoid
        deleting all records like we are currently doing. Commented code below allows us to delete only sections that are not in the updated list
        deleteMany: {
          SocialProfileSectionKey: {
            not: {
              in: userProfileSections.map((section) => section.SocialProfileSectionKey),
            },
          },
        },
        */
        createMany: {
          data: userProfileSections,
        },
      }
    },
  };

  return prisma.user.update(args);
};

const deleteOne = async (login) => {
  const args = {
    where: {
      Login: login,
    },
  };

  return prisma.user.delete(args);
};

export {
  getAll,
  getOne,
  getOneById,
  getOneByIdWithFullData,
  createOne,
  updateOne,
  updateConfig,
  deleteOne,
  search,
};
