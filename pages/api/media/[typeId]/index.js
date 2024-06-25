import apiHandler from 'utils/api/apiHandler';
import * as TMDBService from 'utils/api/tmdb/TMDBService';
import { parseTypeId } from 'utils/api/helpers'
import { UserRepository, UserMediaRepository } from 'utils/api/db';
import { BadRequestError } from 'utils/api/errors';

const getMediaInfo = async (req, res) => {
  const { typeId } = req.query;
  const { userId, userName } = req.auth ?? {}; // this is a public endpoint, users may not be authenticated

  const { mediaId, type } = parseTypeId(typeId);

  const intMediaId = Number.parseInt(mediaId);
  if (!intMediaId) {
    throw new BadRequestError('Invalid Media Id');
  }

  // Getting Guest Session Id (only if user is logged in)
  let guestSessionId = null;
  if (userName) {
    const user = await UserRepository.getOne(userName);
    guestSessionId = user.TMDBGuestSessionId;
  }

  // Getting User Media Relation info (in favorites - in watch later list)
  const getUserMediaRelationInfo = async (type, mediaId) => {
    if (!userId) return null;

    return await UserMediaRepository.getOne(userId, type, mediaId);
  }

  let mediaInfo = null;
  if (type === 'movie') {
    mediaInfo = await TMDBService.getMovieDetails(mediaId, guestSessionId);

    const userMediaRelationInfo = await getUserMediaRelationInfo('movie', intMediaId);

    mediaInfo.inFavorites = userMediaRelationInfo?.IsFavorite ?? false;
    mediaInfo.inWatchLater = userMediaRelationInfo?.IsInWatchLater ?? false;
  } else if (type === 'tv') {
    mediaInfo = await TMDBService.getTvSeriesDetails(mediaId, guestSessionId);

    const userMediaRelationInfo = await getUserMediaRelationInfo('tv', intMediaId);
    mediaInfo.inFavorites = userMediaRelationInfo?.IsFavorite ?? false;
    mediaInfo.inWatchLater = userMediaRelationInfo?.IsInWatchLater ?? false;
  }

  // Getting OneTap Media rating info
  const oneTapUsers = await UserRepository.getAll();
  const oneTapUsersMediaRatings = await TMDBService.getUsersMediaRatings(oneTapUsers, type);
  mediaInfo.oneTapUsersMediaRatings = oneTapUsersMediaRatings.filter((mediaRating) => mediaRating.id === intMediaId);

  res.status(200).json(mediaInfo);
};

export default apiHandler({ get: getMediaInfo }, true);