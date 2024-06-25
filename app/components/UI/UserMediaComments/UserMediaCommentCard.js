import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import classes from 'styles/user-media-comment-card.module.css';
import RoundedProfileImage from "../Social/RoundedProfileImage";

const UserMediaCommentCard = ({ userCommentId, profileImageUrl, userId, userName, createDate, comment, enableDelete, onProfileImageClick, onDeleteComment }) => {
  const handleProfileImageClick = useCallback(() => {
    onProfileImageClick(userId);
  }, [userId, onProfileImageClick]);

  const handleDeleteComment = useCallback(() => {
    onDeleteComment(userCommentId);
  }, [userCommentId, onDeleteComment]);

  return (
    <Row className="justify-content-center mb-2">
      <Col md={8}>
        <Card className={classes.card}>
          <Card.Body>
            <Row className="align-items-center">
              <Col xl={2} lg={2} md={3} sm={3} className={classes.image_container}>
                <RoundedProfileImage onClick={onProfileImageClick ? handleProfileImageClick : null} imageUrl={profileImageUrl} width={75} height={75} />
              </Col>
              <Col xl={9} lg={8} md={7} sm={7} className={classes.comment_container}>
                <p className={classes.username_text}>{userName}</p>
                <p className={classes.create_date_text}>
                  {new Date(createDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {new Date(createDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                <span className={classes.comment_text}>{comment}</span>
              </Col>
              {enableDelete && (
                <Col>
                  <motion.div
                    className="d-flex justify-content-center align-items-center"
                    whileHover={{ scale: 1.2 }}
                  >
                    <FontAwesomeIcon className={classes.delete_comment_icon} icon={faTrash} onClick={handleDeleteComment} />
                  </motion.div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default UserMediaCommentCard;
