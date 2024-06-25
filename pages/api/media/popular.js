import apiHandler from 'utils/api/apiHandler';
import * as TMDBService from 'utils/api/tmdb/TMDBService';

const search = async (req, res) => {
  const results = await TMDBService.getPopularMoviesAndTvSeries();

  res.status(200).json({
    items: results,
  });
};

export default apiHandler({ get: search }, true);