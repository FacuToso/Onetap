import { useRouter } from 'next/router';
import { Row, Col } from 'react-bootstrap';
import classes from 'styles/home.module.css'
import { useCallback, useContext, useState } from 'react';
import AuthContext from 'context/AuthContext';
import { useEffect } from 'react';
import * as API from 'api/API';
import { UserMediaRecommendation, HomeMediaItem, SearchBox, LoadingSpinner } from 'components';
import { motion } from 'framer-motion';

export default function Home() {
  const { isLoggedIn, loadedUserData } = useContext(AuthContext);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [homeMedia, setHomeMedia] = useState([]);

  useEffect(() => {
    if (loadedUserData) {
      setLoading(true);
      Promise.all([
        ...(isLoggedIn ? [API.get(`/user/media/recommendations`)] : [Promise.resolve(null)]),
        API.get('/media')
      ])
        .then(([recommendationsResponse, homeMediaResponse]) => {
          if (recommendationsResponse) setRecommendations(recommendationsResponse.data.items);

          setHomeMedia(homeMediaResponse.data.items);
        })
        .finally(() => setLoading(false));
    }
  }, [loadedUserData, isLoggedIn]);

  const handleSearch = useCallback((searchText) => {
    router.push(`/media/search?query=${searchText}`);
  }, [router]);

  const handleMediaClick = useCallback(({ id, type }) => {
    router.push(`/media/${type}_${id}`);
  }, [router]);

  const renderRecommendations = useCallback(() => {
    return recommendations.map((recommendationInfo, index) => <UserMediaRecommendation key={index} {...recommendationInfo} onMediaClick={handleMediaClick} />);
  }, [recommendations, handleMediaClick]);

  const renderHomeMedia = useCallback(() => {
    return homeMedia.map((homeMedia, index) => <HomeMediaItem key={index} {...homeMedia} onMediaClick={handleMediaClick} />)
  }, [homeMedia, handleMediaClick]);

  return (
    <section id="home" className={classes.container}>
      {loading
        ? <LoadingSpinner />
        : (
          <>
            <Row>
              <Col className={classes.input_container}>
                <motion.div
                  initial={{ y: -100, scale: 1.3 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
                >
                  <SearchBox
                    className={classes.search_box}
                    placeholder="Search Media"
                    onSearch={handleSearch}
                    width={300}
                  />
                </motion.div>
              </Col>
            </Row>
            <motion.div
              initial={{ y: 250, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              delay={0.5}
            >
              {isLoggedIn && recommendations.length > 0 && (
                <Row className="m-2">
                  <Col>
                    {renderRecommendations()}
                  </Col>
                </Row>
              )}
              {homeMedia.length > 0 && (
                <Row className="m-2">
                  <Col>
                    {renderHomeMedia()}
                  </Col>
                </Row>
              )}
            </motion.div>
          </>
        )}
    </section>

  )
}
