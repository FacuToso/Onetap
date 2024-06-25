import apiHandler from 'utils/api/apiHandler';
import * as TMDBService from 'utils/api/tmdb/TMDBService';

const getHomeMoviesAndTvSeries = async (req, res) => {
  const response = await TMDBService.getHomeMoviesAndTvSeries();

  const homeMoviesAndTvSeries = [
    {
      title: '🕒 Now Playing',
      results: response.nowPlaying,
    },
    {
      title: '🔥 Popular',
      results: response.popular,
    },
    {
      title: '⭐ Top Rated',
      results: response.topRated,
    },
    {
      title: '📅 Upcoming',
      results: response.upcoming,
    },
  ]

  res.status(200).json({ items: homeMoviesAndTvSeries });
};

export default apiHandler({ get: getHomeMoviesAndTvSeries }, true);