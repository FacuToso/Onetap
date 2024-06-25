import apiHandler from 'utils/api/apiHandler';
import { TapRepository } from 'utils/api/db';
import { NotFoundError, BadRequestError, ForbiddenError } from 'utils/api/errors';
import * as AWSService from 'utils/api/aws/AWSService';

const getTap = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.auth ?? {};

  const intId = Number.parseInt(id);
  if (!id || Number.isNaN(intId)) {
    throw new BadRequestError('Invalid Tap Id');
  }

  const tap = await TapRepository.getOne(intId);

  if (!tap) {
    throw new NotFoundError('Tap');
  }

  const getUserMainInfo = (dbUser) => ({
    userId: dbUser.UserId,
    userName: dbUser.Login,
    profileImageUrl: AWSService.generateFileUrl(dbUser.ProfileImageAWSKey),
  });

  const getFormattedTapRespondingTo = (tapRespondingTo) => {
    if (!tapRespondingTo) return null;

    return {
      user: getUserMainInfo(tapRespondingTo.User),
      tapId: tapRespondingTo.TapId,
    };
  };

  const getTapMainInfo = (dbTap) => {
    if (!dbTap) return null;
    
    return {
      tapId: dbTap.TapId,
      content: dbTap.Content,
      user: getUserMainInfo(dbTap.User),
      createDate: dbTap.CreateDate,
      editDate: dbTap.EditDate,
      responsesAmount: dbTap.TapResponses.length,
      tapRespondingTo: getFormattedTapRespondingTo(dbTap.TapRespondingTo),
      likes: dbTap.UserTapLikes.map((userTapLike) => getUserMainInfo(userTapLike.User)),
      likesAmount: dbTap.UserTapLikes.length,
      liked: userId ? dbTap.UserTapLikes.some((userTapLike) => userTapLike.User.UserId === userId) : false,
    };
  };

  const tapDto = {
    ...getTapMainInfo(tap),
    tapRespondingTo: getTapMainInfo(tap.TapRespondingTo),
    tapResponses: tap.TapResponses.map(getTapMainInfo),
  };

  res.status(200).json(tapDto);
};

const updateTap = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.auth;
  const { content } = req.body;

  const intId = Number.parseInt(id);
  if (!id || Number.isNaN(intId)) {
    throw new BadRequestError('Invalid Tap Id');
  }

  if (!content || content.length === 0 || content.length > 240) {
    throw new BadRequestError('Invalid Content');
  }

  const tap = await TapRepository.getOne(intId);

  if (!tap) {
    throw new NotFoundError('Tap');
  }

  if (tap.UserId !== userId) {
    throw new ForbiddenError('This Tap is not yours');
  }

  const updatedTap = {
    Content: content,
    EditDate: new Date(),
  };

  await TapRepository.updateOne(tap.TapId, updatedTap);

  res.status(204).send();
};

const deleteTap = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.auth;

  const intId = Number.parseInt(id);
  if (!id || Number.isNaN(intId)) {
    throw new BadRequestError('Invalid Tap Id');
  }

  const tap = await TapRepository.getOne(intId);

  if (!tap) {
    throw new NotFoundError('Tap');
  }

  if (tap.UserId !== userId) {
    throw new ForbiddenError('This Tap is not yours');
  }

  await TapRepository.deleteOne(tap.TapId);

  res.status(204).send();
};

export default apiHandler({ get: getTap, put: updateTap, delete: deleteTap }, true); // TODO: deleteTap must not be public. Find a way to make publicity endpoint-level instead of path level