import apiHandler from 'utils/api/apiHandler';
import { UserTapLikeRepository, UserRepository, TapRepository } from 'utils/api/db';
import { BadRequestError, InvalidOperationError, NotFoundError } from 'utils/api/errors';

const likeTap = async (req, res) => {
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

  const existingUserTapLike = await UserTapLikeRepository.getOne(userId, intId);
  if (existingUserTapLike) {
    throw new InvalidOperationError('You already like this Tap');
  }

  const userTapLike = {
    UserId: userId,
    TapId: intId,
  }

  const dbUserTapLike = await UserTapLikeRepository.createOne(userTapLike);

  res.status(201).json({ userId: dbUserTapLike.UserId, tapId: dbUserTapLike.TapId });
};

const unlikeTap = async (req, res) => {
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

  const existingUserTapLike = await UserTapLikeRepository.getOne(userId, intId);
  if (!existingUserTapLike) {
    throw new InvalidOperationError('You don\'t like this tap');
  }

  await UserTapLikeRepository.deleteOne(existingUserTapLike.UserId, existingUserTapLike.TapId);

  res.status(204).send();
};

export default apiHandler({ post: likeTap, delete: unlikeTap });