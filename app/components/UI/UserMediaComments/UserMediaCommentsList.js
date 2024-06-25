import { useCallback, useContext, useEffect, useState } from "react";
import * as API from 'api/API';
import { LoadingSpinner } from "components";
import classes from 'styles/user-media-comments-list.module.css';
import UserMediaCommentCard from "./UserMediaCommentCard";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import AuthContext from "context/AuthContext";
import { NotificationManager } from "react-notifications";
import { useRouter } from "next/router";

const UserMediaCommentsList = ({ mediaTypeId }) => {
  const { isLoggedIn, userId } = useContext(AuthContext);

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  const loadComments = useCallback(() => {
    if (mediaTypeId) {
      setLoading(true);
      API.get(`/media/${mediaTypeId}/comments`)
        .then((response) => {
          setComments(response.data.items);
        })
        .finally(() => setLoading(false));
    }
  }, [mediaTypeId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleChangeNewCommentText = useCallback((e) => {
    const newValue = e.target.value;

    setNewCommentText(newValue);
  }, []);

  const handleCreateNewComment = useCallback((e) => {
    e.preventDefault();

    setLoading(true);
    const rq = {
      comment: newCommentText,
    };
    API.post(`media/${mediaTypeId}/comments`, rq)
      .then(() => {
        NotificationManager.success('Your comment was succesfully created!');
        setNewCommentText('');
        loadComments();
      })
      .finally(() => setLoading(false));
  }, [newCommentText, mediaTypeId, loadComments])

  const handleProfileImageClick = useCallback((userId) => {
    router.push(`/social/user/${userId}`);
  }, [router]);

  const handleDeleteComment = useCallback((userCommentId) => {
    setLoading(true);
    API.del(`media/${mediaTypeId}/comments/${userCommentId}`)
      .then(() => {
        NotificationManager.success('Your comment was succesfully deleted!');
        loadComments();
      })
      .finally(() => setLoading(false));
  }, [mediaTypeId, loadComments]);

  if (loading) return <LoadingSpinner />

  return (
    <div className={classes.container}>
      {isLoggedIn && (
        <Row className="justify-content-center">
          <Col md={6}>
            <Form onSubmit={handleCreateNewComment}>
              <InputGroup>
                <Form.Control
                  className={classes.searchInput}
                  as="textarea"
                  value={newCommentText}
                  onChange={handleChangeNewCommentText}
                  placeholder={'Comments your thoughts!'}
                />
                <Button className={classes.searchBtn} type="submit" variant="primary">💬 Comment</Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      )}
      <Row>
        <Col className={classes.comments_container}>
          {comments.length === 0
            ? (
              <h3>🛑 No comments were made for this media yet! Be the first!</h3>
            )
            : comments.map((comment) => (
              <UserMediaCommentCard
                key={comment.userCommentId}
                {...comment}
                enableDelete={comment.userId === userId}
                onDeleteComment={handleDeleteComment}
                onProfileImageClick={handleProfileImageClick}
              />
            ))
          }
        </Col>
      </Row>
    </div>
  )
};

export default UserMediaCommentsList;
