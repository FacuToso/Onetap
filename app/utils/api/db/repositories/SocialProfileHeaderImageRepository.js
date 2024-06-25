import prisma from 'utils/api/db/DB';

const getAll = async (options) => {
  const args = {
    ...options,
  };

  return prisma.socialProfileHeaderImage.findMany(args);
};

export {
  getAll,
};
