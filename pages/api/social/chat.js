import apiHandler from 'utils/api/apiHandler';
import { UserRepository, ChatRepository } from 'utils/api/db';
import { BadRequestError, NotFoundError } from 'utils/api/errors';
import * as AWSService from 'utils/api/aws/AWSService';

const formatChatMessage = (chatMessage) => ({
  chatMessageId: chatMessage.ChatMessageId,
  sender: {
    userId: chatMessage.Sender.UserId,
    profileImageUrl: AWSService.generateFileUrl(chatMessage.Sender.ProfileImageAWSKey),
    userName: chatMessage.Sender.Login,
  },
  recipient: {
    userId: chatMessage.Recipient.UserId,
    profileImageUrl: AWSService.generateFileUrl(chatMessage.Recipient.ProfileImageAWSKey),
    userName: chatMessage.Recipient.Login,
  },
  message: chatMessage.Message,
  sentDate: chatMessage.SentDate,
});

const getChat = async (req, res) => {
  const { userId } = req.auth;
  const intUserId = Number.parseInt(userId);

  const userChatMessages = await ChatRepository.getUserChat(intUserId);

  const conversationsDict = {};
  userChatMessages.forEach((chatMessage) => {
    const formattedMessage = formatChatMessage(chatMessage);

    let counterpart = chatMessage.SenderId === intUserId ? chatMessage.Recipient : chatMessage.Sender;

    if (!conversationsDict[counterpart.UserId]) {
      conversationsDict[counterpart.UserId] = {
        user: {
          userId: counterpart.UserId,
          userName: counterpart.Login,
          profileImageUrl: AWSService.generateFileUrl(counterpart.ProfileImageAWSKey),
        },
        messages: [],
      };
    }

    conversationsDict[counterpart.UserId].messages.push(formattedMessage);
  });

  const conversationsArray = Object.keys(conversationsDict)
    .map((key) => conversationsDict[key])
    .sort((conv1, conv2) => {
      const lastConv1Message = conv1.messages[conv1.messages.length - 1];
      const lastConv2Message = conv2.messages[conv2.messages.length - 1];

      return new Date(lastConv1Message.sentDate) > new Date(lastConv2Message.sentDate) ? -1 : 1;
    });

  res.status(200).json({ items: conversationsArray });
};

const sendMessage = async (req, res) => {
  const { userId } = req.auth;
  const { recipientId, message } = req.body;

  const intRecipientId = Number.parseInt(recipientId);
  if (!recipientId || Number.isNaN(recipientId)) {
    throw new BadRequestError('Invalid Recipient');
  }

  if (!message) {
    throw new BadRequestError('Invalid Message');
  }

  const recipient = await UserRepository.getOneById(intRecipientId);
  if (!recipient) {
    throw new NotFoundError('Recipient');
  }

  const newChatMessage = {
    SenderId: userId,
    RecipientId: intRecipientId,
    Message: message,
    SentDate: new Date(),
  };
  const { ChatMessageId } = await ChatRepository.createOne(newChatMessage);

  const newDbChatMessage = await ChatRepository.getOne(ChatMessageId);

  res.status(201).json({ createdChatMessage: formatChatMessage(newDbChatMessage) });
};

export default apiHandler({ get: getChat, post: sendMessage });