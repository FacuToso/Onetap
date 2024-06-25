import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as API from "api/API";
import {
  Row,
  Col,
  Button,
  Badge,
  OverlayTrigger,
  Popover,
  Tooltip,
} from "react-bootstrap";
import classes from "styles/media-summary.module.css";
import {
  LoadingSpinner,
  CastCard,
  MediaSecondaryDataItem,
  MediaSocial,
  PlayVideoModal,
  UserRatingCard,
  AdBox,
  CustomTabs,
  UserMediaCommentsList,
  CustomImage,
  VoteAverage,
} from "components";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faClose,
  faHeart,
  faPlay,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component";
import Head from "next/head";
import { useMemo } from "react";
import { NotificationManager } from "react-notifications";
import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { motion } from "framer-motion";
import { AdImageUrl } from "utils/consts";

const usDollarFormat = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const MediaSummary = () => {
  const { isLoggedIn } = useContext(AuthContext);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const [activeKey, setActiveKey] = useState("RATINGS");
  const [mediaData, setMediaData] = useState({
    type: null,
    name: null,
    backdropImageUrl: null,
    posterImageUrl: null,
    overview: null,
    releaseDate: null,
    genres: [],
    length: null,
    voteAverage: null,
    status: null,
    streamingProvider: {
      providerUrl: null,
      logoImageUrl: null,
      name: null,
    },
    cast: [],
    budget: null,
    revenue: null,
    numberOfSeasons: null,
    numberOfEpisodes: null,
    socialMedia: {
      facebook: null,
      instagram: null,
      twitter: null,
    },
    trailerVideoUrl: null,
    rating: null,
    inFavorites: null,
    inWatchLater: null,
    oneTapUsersMediaRatings: [],
  });

  const watchLaterOverlayTooltip = useMemo(() => {
    let message;
    if (isLoggedIn) message = "Add this media to your Watch Later list!";
    else message = "Log in to add this media to your Watch Later list!";

    return <Tooltip id="log-in-to-watch-later-tooltip">{message}</Tooltip>;
  }, [isLoggedIn]);
  const favoriteOverlayTooltip = useMemo(() => {
    let message;
    if (isLoggedIn) message = "Add this media to your favorites list!";
    else message = "Log in to add this media to your favorites list!";

    return <Tooltip id="log-in-to-watch-later-tooltip">{message}</Tooltip>;
  }, [isLoggedIn]);

  const handleUserClick = useCallback(
    (userId) => {
      router.push(`/social/user/${userId}`);
    },
    [router]
  );

  const renderOneTapRatings = useCallback(() => {
    if (mediaData.oneTapUsersMediaRatings.length === 0)
      return (
        <h3 className="mt-3">
          🛑 No Ratings were created for this media yet! Be the first!
        </h3>
      );

    return mediaData.oneTapUsersMediaRatings.map((rating, index) => (
      <UserRatingCard key={index} {...rating} size={35} onClick={handleUserClick} />
    ));
  }, [mediaData.oneTapUsersMediaRatings, handleUserClick]);

  const { typeId } = router.query;

  const tabs = useMemo(() => {
    return [
      {
        key: "RATINGS",
        title: "⭐️ Ratings",
        render: () => (
          <div className={classes.social_container}>
            {renderOneTapRatings()}
          </div>
        ),
      },
      {
        key: "COMMENTS",
        title: "📝 Comments",
        render: () => <UserMediaCommentsList mediaTypeId={typeId} />,
      },
    ];
  }, [typeId, renderOneTapRatings]);

  const loadMediaData = useCallback(() => {
    if (typeId) {
      setLoading(true);
      API.get(`media/${typeId}`)
        .then((response) => {
          setMediaData(response.data);
        })
        .finally(() => setLoading(false));
    }
  }, [typeId]);

  useEffect(() => {
    loadMediaData();
  }, [loadMediaData]);

  const handlePlayTrailer = useCallback(() => {
    setPlayingTrailer(true);
  }, []);

  const handleStopPlayingTrailer = useCallback(() => {
    setPlayingTrailer(false);
  }, []);

  const renderCast = useCallback(() => {
    if (mediaData.cast.length === 0)
      return <span>No cast was registered for this media yet!</span>;

    return mediaData.cast.map((actor) => (
      <CastCard key={actor.id} {...actor} />
    ));
  }, [mediaData.cast]);

  const renderProviderText = useCallback(() => {
    const text = (
      <span>
        {mediaData.streamingProvider
          ? (
            <>
              Watch on <strong>{mediaData.streamingProvider.name}</strong>
            </>
          )
          : (
            <>
              Only in Cinemas
            </>
          )}

      </span>
    );

    if (mediaData.streamingProvider?.providerUrl) {
      return (
        <a
          className={classes.provider_link}
          href={mediaData.streamingProvider?.providerUrl || "#"}
          target="_blank"
          rel="noreferrer"
        >
          {text}
        </a>
      );
    }

    return text;
  }, [mediaData.streamingProvider]);

  const renderSecondaryData = useCallback(() => {
    if (mediaData.type === "movie") {
      return (
        <>
          <MediaSecondaryDataItem
            name="Budget"
            value={usDollarFormat.format(mediaData.budget)}
          />
          <MediaSecondaryDataItem
            name="Revenue"
            value={usDollarFormat.format(mediaData.revenue)}
          />
        </>
      );
    } else if (mediaData.type === "tv") {
      return (
        <>
          <MediaSecondaryDataItem
            name="Seasons"
            value={mediaData.numberOfSeasons}
          />
          <MediaSecondaryDataItem
            name="Episodes"
            value={mediaData.numberOfEpisodes}
          />
        </>
      );
    }

    return null;
  }, [mediaData]);

  const handleRatingChange = useCallback(
    (newValue) => {
      const rq = {
        rating: newValue,
      };
      API.post(`media/${typeId}/rate`, rq).then(() => {
        setMediaData((prevState) => ({
          ...prevState,
          rating: newValue,
        }));
        NotificationManager.success(
          "Your rating for this movie was succesfully saved!"
        );
        loadMediaData();
      });
    },
    [typeId, loadMediaData]
  );

  const handleDeleteRating = useCallback(() => {
    API.del(`media/${typeId}/rate`).then(() => {
      setMediaData((prevState) => ({
        ...prevState,
        rating: null,
      }));
      NotificationManager.success(
        "Your rating for this movie was succesfully deleted!"
      );
    });
  }, [typeId]);

  const ratingPopover = useMemo(() => {
    if (isLoggedIn) {
      return (
        <Popover id="rating-popover">
          <Popover.Body className="p-0 d-flex">
            {mediaData.rating && (
              <Button
                variant="link"
                className={classes.delete_rating_button}
                onClick={handleDeleteRating}
              >
                <FontAwesomeIcon color="black" icon={faClose} />
              </Button>
            )}
            <ReactStars
              count={5}
              value={mediaData.rating}
              onChange={handleRatingChange}
              size={40}
              isHalf
            />
          </Popover.Body>
        </Popover>
      );
    }

    return (
      <Tooltip id="log-in-to-rate-tooltip">
        Log in to leave your rating!
      </Tooltip>
    );
  }, [isLoggedIn, mediaData.rating, handleDeleteRating, handleRatingChange]);

  const handleBookMarkMedia = useCallback(() => {
    if (!isLoggedIn) return;

    const newInWatchLaterStatus = !mediaData.inWatchLater;
    setMediaData((prevState) => ({
      ...prevState,
      inWatchLater: newInWatchLaterStatus,
    }));

    const rq = {
      isFavorite: mediaData.inFavorites,
      isInWatchLater: newInWatchLaterStatus,
    };
    API.post(`media/${typeId}/relation`, rq).catch(() =>
      setMediaData((prevState) => ({
        ...prevState,
        inWatchLater: !newInWatchLaterStatus,
      }))
    );
  }, [isLoggedIn, typeId, mediaData.inFavorites, mediaData.inWatchLater]);

  const handleMarkMediaAsFavorite = useCallback(() => {
    if (!isLoggedIn) return;

    const newInFavoritesStatus = !mediaData.inFavorites;
    setMediaData((prevState) => ({
      ...prevState,
      inFavorites: newInFavoritesStatus,
    }));

    const rq = {
      isFavorite: newInFavoritesStatus,
      isInWatchLater: mediaData.inWatchLater,
    };
    API.post(`media/${typeId}/relation`, rq).catch(() =>
      setMediaData((prevState) => ({
        ...prevState,
        inFavorites: !newInFavoritesStatus,
      }))
    );
  }, [isLoggedIn, typeId, mediaData.inFavorites, mediaData.inWatchLater]);

  const handleActiveKeyChange = useCallback((newActiveKey) => {
    setActiveKey(newActiveKey);
  }, []);

  const title = `OneTap ${mediaData.name ? `- ${mediaData.name}` : ""}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section id="media_summary">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Row
              className={classes.main_info_container}
              style={{ backgroundImage: `url(${mediaData.backdropImageUrl})` }}
            >
              <motion.div
                initial={{ y: -500 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Row className={classes.main_info_layer}>
                  <Col xl={3} lg={4}>
                    <motion.div
                      initial={{ x: -200, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <Row>
                        <Col className={classes.center}>
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <CustomImage
                              className={classes.image_container}
                              alt="Poster Image"
                              src={mediaData.posterImageUrl}
                              width={250}
                              height={350}
                            />
                          </motion.div>
                        </Col>
                      </Row>
                    </motion.div>
                    <motion.div
                      initial={{ x: -200, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Row className={classes.streaming_provider_row}>
                        <motion.div
                          className={classes.streaming_provider_col}
                          whileHover={{
                            scale: 1.1,
                            transition: { duration: 0.2 },
                          }}
                        >
                          <Col>
                            <Row className="d-flex align-items-center justify-content-center">
                              <Col xl={4} lg={5} md={6} sm={7} xs={6} className="d-flex justify-content-center">
                                <CustomImage
                                  className={classes.provider_image}
                                  alt="Streaming Provider Image"
                                  src={mediaData.streamingProvider?.logoImageUrl}
                                  width={50}
                                  height={50}
                                  noImageFallback="/images/general/no-providers.webp"
                                />
                              </Col>
                              <Col className="text-center">
                                {renderProviderText()}
                              </Col>
                            </Row>
                          </Col>
                        </motion.div>
                      </Row>
                    </motion.div>
                  </Col>
                  <Col xl={6} lg={5} className={classes.information_card}>
                    <Row>
                      <Col>
                        <Row>
                          <Col>
                            <h1>
                              {mediaData.name}
                              {' '}
                              {mediaData.releaseDate && (
                                <span className={classes.text_muted}>
                                  ({new Date(mediaData.releaseDate).getFullYear()})
                                </span>
                              )}
                            </h1>
                            <span className={classes.text_muted}>
                              {mediaData.genres.join(" - ")}{" "}
                              {mediaData.length && `| ${mediaData.length}`}
                            </span>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col>
                            <p>{mediaData.overview}</p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className={classes.rates_row}>
                      <Col className={classes.rates_column}>
                        <div className={classes.rates_container}>
                          <VoteAverage voteAverage={mediaData.voteAverage} />
                        </div>
                      </Col>
                      {isLoggedIn && (
                        <Col>
                          <Row>
                            <Col className={classes.action_column}>
                              <OverlayTrigger
                                rootClose
                                trigger={isLoggedIn ? "click" : ["hover", "focus"]}
                                placement="bottom"
                                overlay={ratingPopover}
                              >
                                <Button
                                  variant={mediaData.rating ? "warning" : "secondary"}
                                // className="rounded-circle"
                                >
                                  <FontAwesomeIcon
                                    color={mediaData.rating ? "yellow" : "white"}
                                    icon={faStar}
                                  />
                                </Button>
                              </OverlayTrigger>
                            </Col>
                            <Col className={classes.action_column}>
                              <motion.div
                                className={classes.action_container}
                                whileHover={{
                                  scale: 1.2,
                                  boxShadow: "0px 0px 10px 0px rgba(0,255,255,1.75)",
                                  borderRadius: "5px",
                                }}
                              >
                                <Button
                                  variant={
                                    mediaData.inWatchLater ? "info" : "secondary"
                                  }
                                  // className="rounded-circle"
                                  onClick={handleBookMarkMedia}
                                >
                                  <FontAwesomeIcon
                                    color={mediaData.inWatchLater ? "white" : "white"}
                                    icon={faBookmark}
                                  />
                                </Button>
                              </motion.div>
                            </Col>
                            <Col className={classes.action_column}>
                              <motion.div
                                className={classes.action_container}
                                whileHover={{
                                  scale: 1.2,
                                  transition: { duration: 0.2 },
                                  boxShadow: "0px 0px 10px 0px rgba(255,0,0,1.75)",
                                  borderRadius: "5px",
                                }}
                              >
                                <Button
                                  variant={
                                    mediaData.inFavorites ? "danger" : "secondary"
                                  }
                                  // className="rounded-circle""
                                  onClick={handleMarkMediaAsFavorite}
                                >
                                  <FontAwesomeIcon
                                    color={mediaData.inFavorites ? "pink" : "white"}
                                    icon={faHeart}
                                  />
                                </Button>
                              </motion.div>
                              {/* </OverlayTrigger> */}
                            </Col>
                            {mediaData.trailerVideoUrl && (
                              <Col className={classes.action_column}>
                                <Button
                                  variant="danger"
                                  onClick={handlePlayTrailer}
                                >
                                  <FontAwesomeIcon icon={faPlay} />
                                </Button>
                              </Col>
                            )}
                          </Row>
                        </Col>
                      )}
                    </Row>
                  </Col>
                  <Col xl={3} lg={3} className={classes.secondary_card}>
                    {(mediaData.socialMedia.facebook || mediaData.socialMedia.instagram || mediaData.socialMedia.twitter) && (
                      <Row className="mb-3">
                        <Col className={classes.social_links_column}>
                          <motion.div
                            initial={{ x: 200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className={`${classes.info_card} ${classes.social_links_card}`}
                          >
                            <strong>Social Links</strong>
                            <MediaSocial links={mediaData.socialMedia} />
                          </motion.div>
                        </Col>
                      </Row>
                    )}
                    <Row>
                      <Col>
                        <motion.div
                          initial={{ x: 200, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.5 }}
                        >
                          <MediaSecondaryDataItem
                            name="Status"
                            value={mediaData.status}
                          />
                          {renderSecondaryData()}
                        </motion.div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <motion.div
                          initial={{ x: 200, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.5 }}
                        >
                          <AdBox imageUrl={AdImageUrl.Ad2} />
                        </motion.div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </motion.div>
            </Row>
            <Row className={classes.secondary_info_container}>
              <Col md={12}>
                <motion.div
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Row>
                    <Col>
                      <h1>🎬 Cast</h1>
                      <motion.div className={classes.cast_container}>
                        {renderCast()}
                      </motion.div>
                    </Col>
                  </Row>
                  <h1>🎭 Social</h1>
                  <Row className="mt-2">
                    <Col>
                      <CustomTabs
                        id="media-social-tabs"
                        tabs={tabs}
                        activeKey={activeKey}
                        onSelectActiveKey={handleActiveKeyChange}
                      // fill
                      />
                    </Col>
                  </Row>
                </motion.div>
              </Col>
            </Row>

            <PlayVideoModal
              visible={playingTrailer}
              title={`${mediaData.name} trailer`}
              videoUrl={mediaData.trailerVideoUrl}
              onClose={handleStopPlayingTrailer}
            />
          </>
        )}
      </section>
    </>
  );
};

export default MediaSummary;
