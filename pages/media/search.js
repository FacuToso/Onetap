import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as API from 'api/API';
import { Row, Col } from 'react-bootstrap';
import classes from 'styles/search.module.css'
import { MediaCard, LoadingSpinner, AdBox, SearchBox } from 'components'
import { AdImageUrl } from 'utils/consts';

const mediaCardImgColSizes = {
  xl: 2,
  lg: 3,
  md: 4,
  sm: 5,
};

const Search = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const search = useCallback((textToSearch) => {
    setLoading(true);
    return API.get('media/search', { query: textToSearch })
      .then((response) => {
        setResults(response.data.items);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (router.query.query) {
      search(router.query.query);
    }
  }, [router.query.query, search]);

  const handleSearch = useCallback(async (searchText) => {
    router.push(`/media/search?query=${searchText}`);
  }, [router]);

  const handleViewMediaMovie = useCallback(({ typeId }) => {
    router.push(`/media/${typeId}`);
  }, [router]);

  const renderResults = useCallback(() => {
    if (results.length === 0) return <span className={classes.no_results}>There are no movies nor TV Series that match with your query</span>
    return results.map((result) => <MediaCard key={result.id} {...result} imgColSizes={mediaCardImgColSizes} showVoteAverage onClick={handleViewMediaMovie} />);
  }, [results, handleViewMediaMovie]);

  return (
    <section id="media_search" className={classes.search_container}>
      <Row>
        <Col>
          <AdBox imageUrl={AdImageUrl.Ad1} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className={classes.input_results_container}>
          <Row className={classes.input_container}>
            <SearchBox
              className={classes.input}
              width={500}
              value={router.query.query}
              onSearch={handleSearch}
            />
          </Row>
          <Row className={classes.results_container}>
            {loading ? <LoadingSpinner /> : renderResults()}
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default Search;