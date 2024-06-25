import { faComment, faEllipsisVertical, faPencil, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { Button, Col, Dropdown, Row } from "react-bootstrap";
import classes from 'styles/tap-card.module.css';
import RoundedProfileImage from "./RoundedProfileImage";
import { timeSince } from 'utils/helpers';

const TapCard = ({
  tapId, tapRespondingTo, content, user, createDate, editDate, responsesAmount, likesAmount, liked, className, disabled, showAdditionalData, enableActions, onSelectTap, onRespondTap, onLikeTap, onProfileImageClick, onDelete, onEdit
}) => {
  const formattedTapDate = useMemo(() => {
    const today = new Date();
    const jsCreateDate = new Date(createDate);

    if (today.getTime() - jsCreateDate.getTime() > 86400000) {
      // Tap was created more than 24hs ago. We'll just show Tap's date
      return jsCreateDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Tap was created less than 24hs ago. We'll show how much time has passed since it was created
    return timeSince(jsCreateDate);
  }, [createDate]);

  const handleSelectTap = useCallback(() => {
    if (disabled || !onSelectTap) return;

    onSelectTap(tapId)
  }, [disabled, tapId, onSelectTap]);

  const handleRespondTap = useCallback((e) => {
    e.stopPropagation();

    if (disabled || !onRespondTap) return;

    onRespondTap(tapId);
  }, [disabled, tapId, onRespondTap]);

  const handleLikeTap = useCallback((e) => {
    e.stopPropagation();

    if (disabled || !onLikeTap) return;

    onLikeTap(tapId);
  }, [disabled, tapId, onLikeTap]);

  const handleProfileImageClick = useCallback((imageUrl) => {
    if (disabled || !onProfileImageClick) return;

    onProfileImageClick({ userId: user.userId, imageUrl });
  }, [user.userId, disabled, onProfileImageClick]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();

    onEdit(tapId);
  }, [tapId, onEdit]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();

    onDelete(tapId);
  }, [tapId, onDelete]);

  const renderActionsIcon = useCallback(() => {
    return (
      <Col xl={2} lg={2} md={2} sm={2} xs={2} className="d-flex justify-content-end">
        <Dropdown>
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle className={classes.actions_dropdown_toggle} variant="link">
              <FontAwesomeIcon className={classes.actions_icon} icon={faEllipsisVertical} />
            </Dropdown.Toggle>
          </div>
          <Dropdown.Menu className={classes.dropdown}>
            <Dropdown.Item className={classes.dropdownItem} onClick={handleEdit}>✏️ Edit</Dropdown.Item>
            <Dropdown.Item className={classes.dropdownItem} onClick={handleDelete}>🗑️ Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    )
  }, [handleEdit, handleDelete]);

  return (
    <div className={`${classes.container} ${className || ''}`} onClick={handleSelectTap}>
      {tapRespondingTo && (
        <Row className="mb-2">
          <Col xl={10} lg={10} md={10} sm={10} xs={10}>
            <Link legacyBehavior href={`/social/tap/${tapRespondingTo.tapId}`} passHref>
              <a className={classes.span_responding_to} role="button" onClick={(e) => e.stopPropagation()}>
                Replying to
                {' '}
                <span className={classes.span_responding_to_user}>{tapRespondingTo.user.userName}</span>
              </a>
            </Link>
          </Col>
          {enableActions && renderActionsIcon()}
        </Row>
      )}
      <Row>
        <Col className={classes.tap_author_image_container}>
          <RoundedProfileImage
            onClick={!disabled && onProfileImageClick ? handleProfileImageClick : null}
            imageUrl={user.profileImageUrl} width={50} height={50}
          />
        </Col>
        <Col>
          <Row>
            <Col xl={10} lg={10} md={10} sm={10} xs={10}>
              <span className={classes.tap_author}>
                {user.userName}
              </span>
              {!showAdditionalData && (
                <>
                  {'   '}
                  <span className={classes.tap_date}>
                    {formattedTapDate}
                  </span>
                </>
              )}
              {editDate && (
                <>
                  {'   '}
                  <FontAwesomeIcon className={classes.tap_edited_icon} icon={faPencil} />
                </>
              )}
            </Col>
            {enableActions && !tapRespondingTo && renderActionsIcon()}
          </Row>
          <Row>
            <Col>
              <p>{content}</p>
            </Col>
          </Row>
          {!disabled && (
            <Row className={classes.interactions_row}>
              <Col xl={5} lg={5} md={5} sm={5} xs={5} className={classes.interactions_column} onClick={handleRespondTap}>
                <Button className={classes.respond_button} variant="link" >
                  <FontAwesomeIcon className={classes.respond_icon} color="white" icon={faComment} />
                  {''}
                </Button>
                <span className={classes.interactions_text}>
                  {' '}
                  {responsesAmount}
                </span>
              </Col>

              <Col xl={5} lg={5} md={5} sm={5} xs={5} className={classes.interactions_column} onClick={handleLikeTap}>
                <Button className={classes.like_button} variant="link" >
                  <FontAwesomeIcon className={classes.like_icon} color={liked ? 'yellow' : 'white'} icon={faStar} />
                </Button>
                <span className={classes.interactions_text}>
                  {' '}
                  {likesAmount}
                </span>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      {showAdditionalData && (
        <Row>
          <Col>
            <span className={classes.tap_date}>
              {new Date(createDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {new Date(createDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </Col>
        </Row>
      )}
    </div>
  )
};

export default TapCard;
