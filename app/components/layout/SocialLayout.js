import {
  LoadingSpinner,
  MediaCard,
  SocialSaveTap,
  AdBox,
  SearchBox,
} from "components";
import AuthContext from "context/AuthContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import * as API from "api/API";
import { useRouter } from "next/router";
import classes from "styles/social-layout.module.css";
import { motion } from "framer-motion";
import { AdImageUrl } from "utils/consts";

const SocialLayout = ({
  children,
  childrenContainerClassName,
  showSearch,
  showCreateTap,
  onTapCreated,
  onOwnProfileImageClick,
  onSearchUsers,
}) => {
  const router = useRouter();

  const { isLoggedIn, userId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [recommendedMedias, setRecommendedMedias] = useState([]);
  const [watchLaterMedias, setWatchLaterMedias] = useState([]);
  const [popularMedias, setPopularMedias] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      if (userId) {
        return Promise.all([
          API.get(`/user/media/recommendations`),
          API.get(`/user/${userId}/media/relation`),
        ]).then(([recommendationsResponse, relationsResponse]) => {
          setRecommendedMedias(
            recommendationsResponse.data.items.flatMap(
              (recommendation) => recommendation.recommendations
            )
          );
          setWatchLaterMedias(
            relationsResponse.data.items.filter(
              (relation) => relation.isInWatchLater
            )
          );
        });
      }

      return API.get(`/media/popular`).then((response) =>
        setPopularMedias(response.data.items)
      );
    };

    fetch().finally(() => setLoading(false));
  }, [userId]);

  const handleNavigateToMedia = useCallback(
    ({ id, type, typeId }) => {
      router.push(`/media/${typeId}`);
    },
    [router]
  );

  return (
    <>
      {showSearch && (
        <Row className="mt-3">
          <Col className={classes.search_users_form_container}>
            <SearchBox
              placeholder="Search Users"
              width={500}
              onSearch={onSearchUsers}
            />
          </Col>
        </Row>
      )}
      <Row className={classes.container}>
        <Col className={classes.media_column}>
          {loading
            ? <LoadingSpinner />
            : (
              <>
                {isLoggedIn ? (
                  <motion.div
                    initial={{ x: -500 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4>❤️ Recommendations based on your favorites</h4>
                    <div className={classes.media_column_data}>
                      {recommendedMedias.length === 0 ? (
                        <span>
                          You have not added any Media to your Watch Later List yet
                        </span>
                      ) : (
                        recommendedMedias.map((media, index) => (
                          <MediaCard
                            key={index}
                            imageWidth={90}
                            imageHeight={150}
                            imgColSizes={{ xl: 3 }}
                            infoContainerClassName={classes.media_card_info_container}
                            {...media}
                            onClick={handleNavigateToMedia}
                          />
                        ))
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ x: -500 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 0.5 }}
                    className={classes.not_logged_in_container}>
                    <h4>Please log in to access all OneTap features</h4>
                    <AdBox imageUrl={AdImageUrl.Ad3} />
                  </motion.div>
                )}
              </>
            )}
        </Col>
        <Col className={classes.data_column}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {showCreateTap && (
              <Row>
                <Col>
                  <SocialSaveTap
                    className={classes.create_tap}
                    onFinish={onTapCreated}
                    onProfileImageClick={onOwnProfileImageClick}
                  />
                </Col>
              </Row>
            )}
            <Row>
              <Col className={childrenContainerClassName}>{children}</Col>
            </Row>
          </motion.div>
        </Col>
        <Col className={classes.media_column}>
          {loading
            ? <LoadingSpinner />
            : (
              <>
                {isLoggedIn
                  ? (
                    <motion.div
                      initial={{ x: 500 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h4>👁‍🗨 Watch Later list</h4>
                      <div className={classes.media_column_data}>
                        {watchLaterMedias.length === 0 ? (
                          <span>You have not marked any Media as Favorite yet</span>
                        ) : (
                          watchLaterMedias.map((relation) => (
                            <MediaCard
                              key={relation.mediaInfo.id}
                              imageWidth={90}
                              imageHeight={150}
                              imgColSizes={{ xl: 3 }}
                              infoContainerClassName={classes.media_card_info_container}
                              {...relation.mediaInfo}
                              onClick={handleNavigateToMedia}
                            />
                          ))
                        )}
                      </div>
                    </motion.div>
                  )
                  : (
                    <>
                      <motion.div
                        initial={{ x: 500 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <h4>🎆 Popular Media</h4>
                        <div className={classes.media_column_data}>
                          {popularMedias.map((media) => (
                            <MediaCard
                              key={media.id}
                              imageWidth={90}
                              imageHeight={150}
                              imgColSizes={{ xl: 3 }}
                              infoContainerClassName={classes.media_card_info_container}
                              {...media}
                              onClick={handleNavigateToMedia}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
              </>
            )}
        </Col >
      </Row>
      <Row className="mt-5">
        <Col>
          <AdBox imageUrl={AdImageUrl.Ad1} />
        </Col>
      </Row>
    </>
  );
};

export default SocialLayout;
