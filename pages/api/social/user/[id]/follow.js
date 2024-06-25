import apiHandler from 'utils/api/apiHandler';
import { UserFollowRepository, UserRepository } from 'utils/api/db';
import { BadRequestError, InvalidOperationError, NotFoundError } from 'utils/api/errors';

const followUser = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.auth;

  const intId = Number.parseInt(id);
  if (!id || Number.isNaN(intId)) {
    throw new BadRequestError('Invalid User Id');
  }

  const followingUser = await UserRepository.getOneById(intId);
  if (!followingUser) {
    throw new NotFoundError('User');
  }

  if (userId === followingUser.UserId) {
    throw new InvalidOperationError('You cannot follow yourself');
  }

  const existingUserTapLike = await UserFollowRepository.getOne(userId, followingUser.UserId);
  if (existingUserTapLike) {
    throw new InvalidOperationError('You already follow this User');
  }

  const userFollow = {
    UserId: userId,
    FollowingUserId: followingUser.UserId,
  }

  const dbUserFollow = await UserFollowRepository.createOne(userFollow);

  res.status(201).json({ userId: dbUserFollow.UserId, followingUserId: dbUserFollow.FollowingUserId });
};

const unfollowUser = async (req, res) => {
  const { id } = req.query;
  const { userId } = req.auth;

  const intId = Number.parseInt(id);
  if (!id || Number.isNaN(intId)) {
    throw new BadRequestError('Invalid User Id');
  }

  const followingUser = await UserRepository.getOneById(intId);
  if (!followingUser) {
    throw new NotFoundError('User');
  }

  const existingUserFollow = await UserFollowRepository.getOne(userId, followingUser.UserId);
  if (!existingUserFollow) {
    throw new InvalidOperationError('You don\'t follow this User');
  }

  await UserFollowRepository.deleteOne(existingUserFollow.UserId, existingUserFollow.FollowingUserId);

  res.status(204).send();
};

export default apiHandler({ post: followUser, delete: unfollowUser });