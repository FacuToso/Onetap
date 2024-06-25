import apiHandler from 'utils/api/apiHandler';
import { UserRepository, UserMediaRepository } from 'utils/api/db';
import { NotFoundError, BadRequestError } from 'utils/api/errors';
import * as TMDBService from 'utils/api/tmdb/TMDBService';
import * as AWSService from 'utils/api/aws/AWSService';

const getUserProfile = async (req, res) => {
  const { id } = req.query;

  const intId = Number.parseInt(id);
  if (!id || Number.isNaN(intId)) {
    throw new BadRequestError('Invalid User Id');
  }

  const user = await UserRepository.getOneByIdWithFullData(intId);

  if (!user) {
    throw new NotFoundError('User');
  }

  const userRatings = await TMDBService.getGuestSessionRatedMedia(user.TMDBGuestSessionId);
  const userFavorites = (await UserMediaRepository.getByUserId(user.UserId)).filter((userMediaRelation) => userMediaRelation.IsFavorite);
  const userFavoritesMediaInfo = await TMDBService.getMultipleMediasDetails(userFavorites.map((userMediaRelation) => ({ 
    mediaId: userMediaRelation.MediaId,
    type: userMediaRelation.MediaType,
  })), user.TMDBGuestSessionId);

  const getUserMainInfo = (dbUser) => ({
    userId: dbUser.UserId,
    userName: dbUser.Login,
    profileImageUrl: AWSService.generateFileUrl(dbUser.ProfileImageAWSKey),
  });

  const getFormattedTapRespondingTo = (tapRespondingTo) => {
    if (!tapRespondingTo) return null;

    return {
      tapId: tapRespondingTo.TapId,
      user: getUserMainInfo(tapRespondingTo.User),
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
      liked: dbTap.UserTapLikes.some((userTapLike) => userTapLike.User.UserId === intId),
    };
  };

  const getRatingMainInfo = (rating) => {
    return {
      id: rating.id,
      type: rating.type,
      typeId: `${rating.type}_${rating.id}`,
      name: rating.name,
      posterImageUrl: rating.posterImageUrl,
      rating: rating.rating,
    };
  };

  const getFavoriteMediaMainInfo = (favoriteMedia) => {
    const mediaInfo = userFavoritesMediaInfo.find((mediaInfo) => mediaInfo.type === favoriteMedia.MediaType && mediaInfo.id === favoriteMedia.MediaId);

    return mediaInfo;
  };

  const getProfileSectionInfo = (userSocialProfileSection) => ({
    key: userSocialProfileSection.SocialProfileSection.Key,
    title: userSocialProfileSection.SocialProfileSection.Title,
  });

  const userDto = { 
    userId: user.UserId,
    userName: user.Login,
    profileImageUrl: AWSService.generateFileUrl(user.ProfileImageAWSKey),
    description: user.ProfileDescription,
    profileColorCode1: user.ProfileColorCode1,
    profileColorCode2: user.ProfileColorCode2,
    taps: user.Taps.map(getTapMainInfo),
    followers: user.Followers.map((userFollow) => getUserMainInfo(userFollow.User)),
    following: user.UsersFollowing.map((userFollow) => getUserMainInfo(userFollow.FollowingUser)),
    userTapsLiked: user.UserTapLikes.map((dbUserTapLike) => getTapMainInfo(dbUserTapLike.Tap)),
    ratings: userRatings.map(getRatingMainInfo),
    favorites: userFavorites.map(getFavoriteMediaMainInfo),
    profileColorCode1: user.ProfileColorCode1,
    profileColorCode2: user.ProfileColorCode2,
    profileHeaderImageUrl: user.ProfileHeaderImageUrl,
    profileSections: user.UserSocialProfileSections.map(getProfileSectionInfo),
  }

  res.status(200).json(userDto);
};

export default apiHandler({ get: getUserProfile }, true);