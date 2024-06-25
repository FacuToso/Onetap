import apiHandler from 'utils/api/apiHandler';
import { UserMediaRepository, UserRepository } from 'utils/api/db';
import { NotFoundError, BadRequestError } from 'utils/api/errors';
import * as TMDBService from 'utils/api/tmdb/TMDBService';

const getUserMediaRelations = async (req, res) => {
  const { id } = req.query;

  const intUserId = Number.parseInt(id);
  if (!intUserId) {
    throw new BadRequestError('Invalid User Id');
  }

  const user = await UserRepository.getOneById(intUserId);
  if (!user) {
    throw new NotFoundError('User');
  }

  const relations = await UserMediaRepository.getByUserId(user.UserId);
  
  const mediaData = await Promise.all(relations.map((relation) => {
    if (relation.MediaType === 'movie') return TMDBService.getMovieDetails(relation.MediaId, user.TMDBGuestSessionId);

    return TMDBService.getTvSeriesDetails(relation.MediaId, user.TMDBGuestSessionId);
  }))

  const relationDtos = relations.map((relation) => {
    const currentMediaInfo = mediaData.find((mediaData) => mediaData.type === relation.MediaType && mediaData.id === relation.MediaId);
    
    return {
      isFavorite: relation.IsFavorite,
      isInWatchLater: relation.IsInWatchLater,
      mediaInfo: {
        ...currentMediaInfo,
        typeId: `${currentMediaInfo.type}_${currentMediaInfo.id}`,
      },
    }
  });

  res.status(200).json({ items: relationDtos });
};

export default apiHandler({ get: getUserMediaRelations }, true);