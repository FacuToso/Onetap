import apiHandler from 'utils/api/apiHandler';
import * as TMDBService from 'utils/api/tmdb/TMDBService';
import { BadRequestError } from 'utils/api/errors';
import { UserRepository } from 'utils/api/db';
import { parseTypeId } from 'utils/api/helpers'

const rate = async (req, res) => {
  const { userName } = req.auth;
  const { typeId } = req.query;
  const { rating: starsRating } = req.body;

  const { mediaId, type } = parseTypeId(typeId);

  const numberStarsRating = Number.parseFloat(starsRating);
  if (!numberStarsRating || numberStarsRating < 0.5 || numberStarsRating > 5.0) {
    throw new BadRequestError('Invalid Rating');
  }

  const user = await UserRepository.getOne(userName);
  const guestSessionId = user.TMDBGuestSessionId;
  if (type === 'movie') {
    await TMDBService.rateMovie(mediaId, numberStarsRating, guestSessionId);
  } else if (type === 'tv') {
    await TMDBService.rateTvSeries(mediaId, numberStarsRating, guestSessionId);
  }
 
  res.status(204).send();
};

const deleteRating = async (req, res) => {
  const { userName } = req.auth;
  const { typeId } = req.query;
  const { mediaId, type } = parseTypeId(typeId);

  const user = await UserRepository.getOne(userName);
  const guestSessionId = user.TMDBGuestSessionId;
  if (type === 'movie') {
    await TMDBService.deleteMovieRating(mediaId, guestSessionId);
  } else if (type === 'tv') {
    await TMDBService.deleteTvSeriesRating(mediaId, guestSessionId);
  }

  res.status(204).send();
};

export default apiHandler({ post: rate, delete: deleteRating });