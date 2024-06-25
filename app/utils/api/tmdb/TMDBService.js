import * as TMDBApi from './TMDBApi';
import * as AWSService from 'utils/api/aws/AWSService';

// TODO: check if we can somehow get provider specific movie's URL (not returned by TMDB)
const providerUrls = {
  'Netflix': 'https://www.netflix.com/',
  'Amazon Prime Video': 'https://www.primevideo.com/',
  'Disney Plus': 'https://www.disneyplus.com/',
  'HBO Max': 'https://www.hbomax.com/',
  'Star Plus': 'https://www.starplus.com/'
}

const formatTmdbMediaResult = (result, fallbackType) => ({
  id: result.id,
  name: result.name || result.title,
  overview: result.overview,
  popularity: result.popularity,
  releaseDate: result.first_air_date || result.release_date,
  voteAverage: Math.floor(result.vote_average * 10),
  posterImageUrl: result.poster_path ? `${process.env.TMDB_POSTER_LARGE_IMAGE_BASE_URL}${result.poster_path}` : null,
  backdropImageUrl: result.backdrop_path ? `${process.env.TMDB_BACKDROP_IMAGE_BASE_URL}${result.backdrop_path}` : null,
  type: result.media_type || fallbackType, // 'movie' - 'tv'
});

const getMediaTrailerUrl = (videos) => {
  // Finding first published official video of type Trailer
  const trailer = videos.sort((v1, v2) => v1.published_at > v2.published_at ? 1 : -1).find((video) => video.official && video.type === 'Trailer');
  if (!trailer) return null;

  const { site, key } = trailer;
  switch (site) {
    case 'YouTube': return `https://youtube.com/watch?v=${key}`;
    default: return null;
  }
}

const getStarsRatingFromTMDBRating = (tmdbRating) => {
  // TMDB Rating Points will be a number between 1 and 10. We'll convert that number to a 0-5 scale (stars)
  if (tmdbRating === null) return null;

  return tmdbRating / 2;
};

const getTMDBRatingFromStars = (stars) => {
  // Stars will be a number between 0.5 and 5. We'll convert that number to a 1-10 scale (TMDB rating)
  return stars * 2;
};

const getMoviesAndTvSeries = async (query) => {
  const rq = {
    query
  };

  return TMDBApi.get('search/multi', rq)
    .then((response) => {
      return response.data.results.filter(({ media_type }) => media_type === 'movie' || media_type === 'tv').map(formatTmdbMediaResult);
    });
};

const getMovieDetails = async (id, guestSessionId = null) => {
  return Promise.all([
    TMDBApi.get(`movie/${id}`, { append_to_response: 'external_ids,videos' }),
    TMDBApi.get(`movie/${id}/watch/providers`),
    TMDBApi.get(`movie/${id}/credits`),
    ...(guestSessionId ? [getGuestSessionRatedMovies(guestSessionId)] : []),
  ])
    .then(([movieResponse, providersResponse, creditsResponse, ratingResults]) => {
      return {
        id: movieResponse.data.id,
        type: 'movie',
        name: movieResponse.data.title,
        overview: movieResponse.data.overview,
        popularity: movieResponse.data.popularity,
        releaseDate: movieResponse.data.release_date,
        posterImageUrl: movieResponse.data.poster_path ? `${process.env.TMDB_POSTER_LARGE_IMAGE_BASE_URL}${movieResponse.data.poster_path}` : null,
        backdropImageUrl: movieResponse.data.backdrop_path ? `${process.env.TMDB_BACKDROP_IMAGE_BASE_URL}${movieResponse.data.backdrop_path}` : null,
        genres: movieResponse.data.genres.map((genre) => genre.name),
        length: movieResponse.data.runtime ? `${Math.floor(movieResponse.data.runtime / 60)} h ${movieResponse.data.runtime % 60} min` : null,
        voteAverage: Math.floor(movieResponse.data.vote_average * 10),
        status: movieResponse.data.status,
        streamingProvider: providersResponse.data.results.AR?.flatrate
          ? {
            providerUrl: providerUrls[providersResponse.data.results.AR.flatrate[0].provider_name] || null,
            logoImageUrl: providersResponse.data.results.AR.flatrate[0].logo_path ? `${process.env.TMDB_LOGO_IMAGE_BASE_URL}${providersResponse.data.results.AR.flatrate[0].logo_path}` : null,
            name: providersResponse.data.results.AR.flatrate[0].provider_name,
          }
          : null,
        cast: creditsResponse.data.cast.map((actor) => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
        })),
        budget: movieResponse.data.budget,
        revenue: movieResponse.data.revenue,
        numberOfSeasons: null,
        numberOfEpisodes: null,
        socialMedia: {
          facebook: movieResponse.data.external_ids.facebook_id ? `https://facebook.com/${movieResponse.data.external_ids.facebook_id}` : null,
          instagram: movieResponse.data.external_ids.instagram_id ? `https://instagram.com/${movieResponse.data.external_ids.instagram_id}` : null,
          twitter: movieResponse.data.external_ids.twitter_id ? `https://twitter.com/${movieResponse.data.external_ids.twitter_id}` : null,
        },
        trailerVideoUrl: getMediaTrailerUrl(movieResponse.data.videos.results),
        rating: ratingResults
          ? getStarsRatingFromTMDBRating(ratingResults.find((result) => result.id === movieResponse.data.id)?.rating ?? null)
          : null,
      };
    })
    .then((formattedMovie) => {
      // Gets each actor's profile image URL and makes the movie cast array to include the URLs
      return Promise.all(formattedMovie.cast.map((actor) => {
        return getPersonProfileImageUrl(actor.id)
          .then((url) => ({
            ...actor,
            profileImageUrl: url,
          }));
      }))
        .then((castWithProfileImages) => ({ ...formattedMovie, cast: castWithProfileImages }))
    });
};

const getTvSeriesDetails = async (id, guestSessionId = null) => {
  return Promise.all([
    TMDBApi.get(`tv/${id}`, { append_to_response: 'external_ids,videos' }),
    TMDBApi.get(`tv/${id}/watch/providers`),
    TMDBApi.get(`tv/${id}/credits`),
    ...(guestSessionId ? [getGuestSessionRatedTvSeries(guestSessionId)] : []),
  ])
    .then(([tvResponse, providersResponse, creditsResponse, ratingResults]) => {
      return {
        id: tvResponse.data.id,
        type: 'tv',
        name: tvResponse.data.name,
        overview: tvResponse.data.overview,
        popularity: tvResponse.data.popularity,
        releaseDate: tvResponse.data.first_air_date,
        posterImageUrl: tvResponse.data.poster_path ? `${process.env.TMDB_POSTER_LARGE_IMAGE_BASE_URL}${tvResponse.data.poster_path}` : null,
        backdropImageUrl: tvResponse.data.backdrop_path ? `${process.env.TMDB_BACKDROP_IMAGE_BASE_URL}${tvResponse.data.backdrop_path}` : null,
        genres: tvResponse.data.genres.map((genre) => genre.name),
        length: tvResponse.data.episode_run_time[0] ? `${tvResponse.data.episode_run_time[0]}m` : null,
        voteAverage: Math.floor(tvResponse.data.vote_average * 10),
        status: tvResponse.data.status,
        streamingProvider: providersResponse.data.results.AR?.flatrate
          ? {
            providerUrl: providerUrls[providersResponse.data.results.AR.flatrate[0].provider_name] || null,
            logoImageUrl: providersResponse.data.results.AR.flatrate[0].logo_path ? `${process.env.TMDB_LOGO_IMAGE_BASE_URL}${providersResponse.data.results.AR.flatrate[0].logo_path}` : null,
            name: providersResponse.data.results.AR.flatrate[0].provider_name,
          }
          : null,
        cast: creditsResponse.data.cast.map((actor) => ({
          id: actor.id,
          name: actor.name,
          character: actor.character,
        })),
        budget: null,
        revenue: null,
        numberOfSeasons: tvResponse.data.number_of_seasons,
        numberOfEpisodes: tvResponse.data.number_of_episodes,
        socialMedia: {
          facebook: tvResponse.data.external_ids.facebook_id ? `https://facebook.com/${tvResponse.data.external_ids.facebook_id}` : null,
          instagram: tvResponse.data.external_ids.instagram_id ? `https://instagram.com/${tvResponse.data.external_ids.instagram_id}` : null,
          twitter: tvResponse.data.external_ids.twitter_id ? `https://twitter.com/${tvResponse.data.external_ids.twitter_id}` : null,
        },
        trailerVideoUrl: getMediaTrailerUrl(tvResponse.data.videos.results),
        rating: ratingResults
          ? getStarsRatingFromTMDBRating(ratingResults.find((result) => result.id === tvResponse.data.id)?.rating ?? null)
          : null,
      }
    })
    .then((formattedMovie) => {
      // Gets each actor's profile image URL and makes the movie cast array to include the URLs
      return Promise.all(formattedMovie.cast.map((actor) => {
        return getPersonProfileImageUrl(actor.id)
          .then((url) => ({
            ...actor,
            profileImageUrl: url,
          }));
      }))
        .then((castWithProfileImages) => ({ ...formattedMovie, cast: castWithProfileImages }))
    });
};

const getPersonProfileImageUrl = async (personId) => {
  return TMDBApi.get(`person/${personId}/images`)
    .then((response) => {
      return response.data.profiles[0]?.file_path ? `${process.env.TMDB_PROFILE_IMAGE_BASE_URL}${response.data.profiles[0].file_path}` : null;
    });
};

const createGuestSessionId = async () => {
  return TMDBApi.get('authentication/guest_session/new')
    .then((response) => {
      if (response.data.success) {
        // After creating the guest session, we'll create a new Rating and then delete it to avoid guest session from being deleted by TMDB
        return getMoviesAndTvSeries('s')
          .then((results) => results.find((result) => result.type === 'movie').id)
          .then((movieId) => {
            return rateMovie(movieId, 5.0, response.data.guest_session_id)
              .then(() => deleteMovieRating(movieId, response.data.guest_session_id));
          })
          .then(() => ({
            guestSessionId: response.data.guest_session_id,
            expiresAt: response.data.expires_at,
          }));
      }

      throw new Error('There was a problem while generating TMDB Guest Session Id');
    });
};

const rateMovie = async (id, starsRating, guestSessionId) => {
  const rq = {
    value: getTMDBRatingFromStars(starsRating)
  };

  return TMDBApi.post(`/movie/${id}/rating?guest_session_id=${guestSessionId}`, rq, { useApiKeyAuthentication: true })
    .then((response) => {
      if (response.status !== 201) {
        throw new Error('There was a problem while rating this Movie');
      }

      return null;
    });
};

const deleteMovieRating = async (id, guestSessionId) => {
  return TMDBApi.del(`/movie/${id}/rating?guest_session_id=${guestSessionId}`, null, { useApiKeyAuthentication: true })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('There was a problem while deleting the rating for this Movie');
      }

      return null;
    })
};

const rateTvSeries = async (id, starsRating, guestSessionId) => {
  const rq = {
    value: getTMDBRatingFromStars(starsRating)
  };

  return TMDBApi.post(`/tv/${id}/rating?guest_session_id=${guestSessionId}`, rq, { useApiKeyAuthentication: true })
    .then((response) => {
      if (response.status !== 201) {
        throw new Error('There was a problem while rating this TV Series');
      }

      return null;
    });
};

const deleteTvSeriesRating = async (id, guestSessionId) => {
  return TMDBApi.del(`/tv/${id}/rating?guest_session_id=${guestSessionId}`, null, { useApiKeyAuthentication: true })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error('There was a problem while deleting the rating for this TV Series');
      }

      return null;
    })
};

const getGuestSessionRatedMovies = async (guestSessionId) => {
  return TMDBApi.get(`guest_session/${guestSessionId}/rated/movies`, null, { useApiKeyAuthentication: true })
    .then((response) => response.data.results)
    .catch(() => []);
}

const getGuestSessionRatedTvSeries = async (guestSessionId) => {
  return TMDBApi.get(`guest_session/${guestSessionId}/rated/tv`, null, { useApiKeyAuthentication: true })
    .then((response) => response.data.results)
    .catch(() => []);
};

const getGuestSessionRatedMedia = async (guestSessionId) => {
  return Promise.all([
    getGuestSessionRatedMovies(guestSessionId),
    getGuestSessionRatedTvSeries(guestSessionId),
  ])
    .then(([ratedMovies, ratedTvSeries]) => {
      const formattedRatedMovies = ratedMovies.map((result) => ({
        id: result.id,
        type: 'movie',
        name: result.title,
        posterImageUrl: result.poster_path ? `${process.env.TMDB_POSTER_SMALL_IMAGE_BASE_URL}${result.poster_path}` : null,
        rating: getStarsRatingFromTMDBRating(result.rating),
      }));

      const formattedRatedTvSeries = ratedTvSeries.map((result) => ({
        id: result.id,
        type: 'tv',
        name: result.name,
        posterImageUrl: result.poster_path ? `${process.env.TMDB_POSTER_SMALL_IMAGE_BASE_URL}${result.poster_path}` : null,
        rating: getStarsRatingFromTMDBRating(result.rating),
      }));

      return [
        ...formattedRatedMovies,
        ...formattedRatedTvSeries,
      ];
    });
};

const getMovieRecommendations = async (id) => {
  return TMDBApi.get(`/movie/${id}/recommendations`)
    .then((response) => {
      return response.data.results.map((result) => ({
        id: result.id,
        type: 'movie',
        name: result.title,
        overview: result.overview,
        popularity: result.popularity,
        releaseDate: result.release_date,
        voteAverage: result.vote_average,
        posterImageUrl: result.poster_path ? `${process.env.TMDB_POSTER_LARGE_IMAGE_BASE_URL}${result.poster_path}` : null,
        backdropImageUrl: result.backdrop_path ? `${process.env.TMDB_BACKDROP_IMAGE_BASE_URL}${result.backdrop_path}` : null,
      }));
    });
};

const getTvSeriesRecommendations = async (id) => {
  return TMDBApi.get(`/tv/${id}/recommendations`)
    .then((response) => {
      return response.data.results.map((result) => ({
        id: result.id,
        type: 'tv',
        name: result.name,
        overview: result.overview,
        popularity: result.popularity,
        releaseDate: result.first_air_date,
        voteAverage: result.vote_average,
        posterImageUrl: result.poster_path ? `${process.env.TMDB_POSTER_LARGE_IMAGE_BASE_URL}${result.poster_path}` : null,
        backdropImageUrl: result.backdrop_path ? `${process.env.TMDB_BACKDROP_IMAGE_BASE_URL}${result.backdrop_path}` : null,
      }));
    })
};

const getUsersMediaRatings = async (users, mediaType) => {
  const getGuestSessionRatingPromiseFn = mediaType === 'movie' ? getGuestSessionRatedMovies : getGuestSessionRatedTvSeries;

  return Promise.all(users.map((user) => {
    return getGuestSessionRatingPromiseFn(user.TMDBGuestSessionId)
      .then((ratings) => ratings.map((rating) => ({
        ...rating,
        userId: user.UserId,
        userName: user.Login,
        profileImageUrl: AWSService.generateFileUrl(user.ProfileImageAWSKey),
        rating: getStarsRatingFromTMDBRating(rating.rating ?? null),
      })));
  }))
    .then((usersRatings) => usersRatings.flatMap((rating) => rating));
};

const getMultipleMediasDetails = async (mediaTypesIds, guestSessionId = null) => {
  return Promise.all(mediaTypesIds.map(({ mediaId, type }) => {
    if (type === 'movie') return getMovieDetails(mediaId, guestSessionId);

    return getTvSeriesDetails(mediaId, guestSessionId);
  }))
    .then((arrayOfDetails) => arrayOfDetails.flatMap((details) => details));
}

// Now Playing
const getNowPlayingMovies = async () => {
  return TMDBApi.get('/movie/now_playing')
    .then((response) => response.data.results.map((result) => formatTmdbMediaResult(result, 'movie')));
};

const getOnTheAirTvSeries = async () => {
  return TMDBApi.get('/tv/on_the_air')
    .then((response) => response.data.results.map((result) => formatTmdbMediaResult(result, 'tv')));
};

const getNowPlayingMoviesAndTvSeries = async () => {
  return Promise.all([
    getNowPlayingMovies(),
    getOnTheAirTvSeries(),
  ])
    .then(([nowPlayingMovies, onTheAirTvSeries]) => [
      ...nowPlayingMovies,
      ...onTheAirTvSeries
    ])
};

// Popular
const getPopularMovies = async () => {
  return TMDBApi.get('/movie/popular')
    .then((response) => response.data.results.map((result) => formatTmdbMediaResult(result, 'movie')));
};

const getPopularTvSeries = async () => {
  return TMDBApi.get('/tv/popular')
    .then((response) => response.data.results.map((result) => formatTmdbMediaResult(result, 'tv')));
};

const getPopularMoviesAndTvSeries = async () => {
  return Promise.all([
    getPopularMovies(),
    getPopularTvSeries(),
  ])
    .then(([popularMovies, popularTvSeries]) => [
      ...popularMovies,
      ...popularTvSeries
    ])
};

// Top Rated
const getTopRatedMovies = async () => {
  return TMDBApi.get('/movie/top_rated')
    .then((response) => response.data.results.map((result) => formatTmdbMediaResult(result, 'movie')));
};

const getTopRatedTvSeries = async () => {
  return TMDBApi.get('/tv/top_rated')
    .then((response) => response.data.results.map((result) => formatTmdbMediaResult(result, 'tv')));
};

const getTopRatedMoviesAndTvSeries = async () => {
  return Promise.all([
    getTopRatedMovies(),
    getTopRatedTvSeries(),
  ])
    .then(([topRatedMovies, topRatedTvSeries]) => [
      ...topRatedMovies,
      ...topRatedTvSeries
    ])
};

// Upcoming
const getUpcomingMovies = async () => {
  return TMDBApi.get('/movie/upcoming')
    .then((response) => response.data.results.map((result) => formatTmdbMediaResult(result, 'movie')));
};

const getHomeMoviesAndTvSeries = async () => {
  return Promise.all([
    getNowPlayingMoviesAndTvSeries(),
    getPopularMoviesAndTvSeries(),
    getTopRatedMoviesAndTvSeries(),
    getUpcomingMovies(),
  ])
    .then(([nowPlaying, popular, topRated, upcoming]) => ({
      nowPlaying,
      popular,
      topRated,
      upcoming,
    }))
};

export {
  getMoviesAndTvSeries,
  getMovieDetails,
  getTvSeriesDetails,
  createGuestSessionId,
  rateMovie,
  deleteMovieRating,
  rateTvSeries,
  deleteTvSeriesRating,
  getMovieRecommendations,
  getTvSeriesRecommendations,
  getUsersMediaRatings,
  getGuestSessionRatedMedia,
  getMultipleMediasDetails,
  getNowPlayingMoviesAndTvSeries,
  getPopularMoviesAndTvSeries,
  getTopRatedMoviesAndTvSeries,
  getUpcomingMovies,
  getHomeMoviesAndTvSeries,
};
