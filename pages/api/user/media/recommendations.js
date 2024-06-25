import apiHandler from 'utils/api/apiHandler';
import { UserMediaRepository, UserRepository } from 'utils/api/db';
import * as TMDBService from 'utils/api/tmdb/TMDBService';

const getUserRecommendations = async (req, res) => {
  const { userId } = req.auth;

  const favoriteRelations = await UserMediaRepository.getByUserId(userId, { IsFavorite: true });

  const mediaRecommendations = await Promise.all(favoriteRelations.map((relation) => {
    let recommendedByPromiseFn;
    let recommendationsPromiseFn;
    if (relation.MediaType === 'movie') {
      recommendedByPromiseFn = TMDBService.getMovieDetails;
      recommendationsPromiseFn = TMDBService.getMovieRecommendations
    }
    else {
      recommendedByPromiseFn = TMDBService.getTvSeriesDetails;
      recommendationsPromiseFn = TMDBService.getTvSeriesRecommendations;
    }

    return Promise.all([
      recommendedByPromiseFn(relation.MediaId),
      recommendationsPromiseFn(relation.MediaId), 
    ])
      .then(([recommendedByMediaData, recommendations]) => ({
        recommendedBy: recommendedByMediaData.name,
        recommendations,
      }));
  }));

  res.status(200).json({ items: mediaRecommendations });
};

export default apiHandler({ get: getUserRecommendations });