import apiHandler from 'utils/api/apiHandler';
import { TapRepository } from 'utils/api/db';
import * as AWSService from 'utils/api/aws/AWSService';

const getFeed = async (req, res) => {
  const { userId } = req.auth ?? {};

  let taps = [];
  if (userId) {
    taps = await TapRepository.getUserFeed(userId);
  } else {
    taps = await TapRepository.getNotLoggedInFeed();
  }

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

  const tapsDto = taps.map((dbTap) => {
    if (!dbTap) return null;

    return {
      tapId: dbTap.TapId,
      content: dbTap.Content,
      user: getUserMainInfo(dbTap.User),
      createDate: dbTap.CreateDate,
      editDate: dbTap.EditDate,
      responsesAmount: dbTap.TapResponses.length,
      tapRespondingTo: getFormattedTapRespondingTo(dbTap.TapRespondingTo),
      likesAmount: dbTap.UserTapLikes.length,
      liked: dbTap.UserTapLikes.some((userTapLike) => userTapLike.UserId === userId),
    };
  });

  res.status(200).json({ taps: tapsDto });
};

export default apiHandler({ get: getFeed }, true);