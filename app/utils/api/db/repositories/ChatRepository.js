import prisma from 'utils/api/db/DB';

const getOne = async (chatMessageId, rest = null) => {
  const args = {
    where: {
      ChatMessageId: chatMessageId,
    },
    include: {
      Sender: true,
      Recipient: true,
    },
    ...rest,
  };

  return prisma.chatMessage.findFirst(args);
};

const getUserChat = async (userId) => {
  const args = {
    where: {
      OR: [
        {
          SenderId: userId,
        },
        {
          RecipientId: userId,
        },
      ],
    },
    include: {
      Sender: true,
      Recipient: true,
    },
    orderBy: {
      SentDate: 'asc',
    }
  };

  return prisma.chatMessage.findMany(args);
};

const createOne = async (chatMessage) => {
  const args = {
    data: chatMessage,
  };

  return prisma.chatMessage.create(args);
};

export {
  getOne,
  getUserChat,
  createOne,
};
