import { useRouter } from "next/router";
import { useEffect, useCallback, useState, useMemo } from "react";
import { Row } from "react-bootstrap";
import classes from 'styles/my-media.module.css';
import * as API from 'api/API';
import { LoadingSpinner, MediaCard, CustomTabs } from 'components'
import { useContext } from "react";
import AuthContext from 'context/AuthContext';

const mediaCardImgColSizes = {
  xl: 2,
  lg: 3,
  md: 4,
  sm: 5,
};

const UserMedia = () => {
  const { userId } = useContext(AuthContext);

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [relations, setRelations] = useState([]);
  const [activeKey, setActiveKey] = useState('WATCH_LATER');

  const handleRatedMediaCardClicked = useCallback(({ typeId }) => {
    router.push(`/media/${typeId}`);
  }, [router]);

  const userMediaTabs = useMemo(() => [
    {
      key: 'WATCH_LATER',
      title: 'Watch Later',
      render: () => (
        <>
          {relations.length > 0
            ? relations.filter((relation) => relation.isInWatchLater).map((relation, index) => <MediaCard key={index} className={classes.media_card} {...relation.mediaInfo} imgColSizes={mediaCardImgColSizes} onClick={handleRatedMediaCardClicked} />)
            : <h3>🛑 You haven&apos;t added any Media to your Watch List</h3>}
        </>
      )
    },
    {
      key: 'FAVORITES',
      title: 'Favorites',
      render: () => (
        <>
          {relations.length > 0
            ? relations.filter((relation) => relation.isFavorite).map((relation, index) => <MediaCard key={index} className={classes.media_card} {...relation.mediaInfo} imgColSizes={mediaCardImgColSizes} onClick={handleRatedMediaCardClicked} />)
            : <h3>🛑 You haven&apos;t added any Media to your Favorites List</h3>}
        </>
      )
    },
  ], [relations, handleRatedMediaCardClicked]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      API.get(`/user/${userId}/media/relation`)
        .then((response) => setRelations(response.data.items))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const handleActiveKeyChange = useCallback((newActiveKey) => {
    setActiveKey(newActiveKey);
  }, []);

  return (
    <section id="user-media" className={classes.container}>
      <Row className={classes.results_container}>
        {loading
          ? <LoadingSpinner />
          : (
            <CustomTabs
              id="user-media-tabs"
              tabs={userMediaTabs}
              activeKey={activeKey}
              onSelectActiveKey={handleActiveKeyChange}
              fill
            />
          )}
      </Row>
    </section>
  )
};

export default UserMedia;
