import apiHandler from 'utils/api/apiHandler';
import * as TMDBService from 'utils/api/tmdb/TMDBService';

const search = async (req, res) => {
  const { query } = req.query;

  const results = await TMDBService.getMoviesAndTvSeries(query);

  res.status(200).json({
    items: results,
  });
};

export default apiHandler({ get: search }, true);