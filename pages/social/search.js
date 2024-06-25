import { useRouter } from "next/router";
import { useEffect, useCallback, useState } from "react";
import { Col, Row } from "react-bootstrap";
import classes from 'styles/social-search.module.css';
import * as API from 'api/API';
import { LoadingSpinner, UserCard, SearchBox } from 'components'

const Search = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const search = useCallback((textToSearch) => {
    setLoading(true);
    API.get(`/social/user?query=${textToSearch}`)
      .then((response) => setUsers(response.data.items))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (router.query.query) {
      search(router.query.query);
    }
  }, [router.query.query, search]);

  const handleSearch = useCallback((searchText) => {
    router.push(`/social/search?query=${searchText}`);
  }, [router]);

  const onUserClick = useCallback((userId) => {
    router.push(`/social/user/${userId}`);
  }, [router]);

  const renderResults = useCallback(() => {
    return users.map((user) => <UserCard key={user.userId} className={classes.user_card} onClick={onUserClick} {...user} />)
  }, [users, onUserClick]);

  return (
    <section id="social-search" className={classes.container}>
      <Row className="mt-3">
        <Col className={classes.search_users_form_container}>
          <SearchBox placeholder="Search Users" width={500} value={router.query.query} onSearch={handleSearch} />
        </Col>
      </Row>
      <Row className={classes.results_container}>
        {loading ? <LoadingSpinner /> : renderResults()}
      </Row>
    </section>
  )
};

export default Search;
