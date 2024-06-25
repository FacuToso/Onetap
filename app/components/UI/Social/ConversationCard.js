import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import classes from 'styles/conversation-card.module.css'
import RoundedProfileImage from "./RoundedProfileImage";
import { BackButton } from 'components';

const ConversationCard = ({ className, userId, chatMessage, userName, profileImageUrl, showReplyIcon, selected, onClick, onGoBack }) => {
  const formattedSentDate = useMemo(() => {
    if (!chatMessage?.sentDate) return null;

    const jsSentDate = new Date(chatMessage.sentDate);
    const today = new Date();

    // Removing time from dates
    jsSentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Comparing dates. If message is from today, we'll show its time. Otherwise, its date.
    if (jsSentDate.getTime() === today.getTime()) {
      return new Date(chatMessage.sentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    return jsSentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
  }, [chatMessage?.sentDate]);

  const handleClick = useCallback(() => {
    if (onClick) onClick(userId);
  }, [userId, onClick]);

  const handleBackClick = useCallback((e) => {
    e.stopPropagation();

    onGoBack();
  }, [onGoBack])

  return (
    <Card className={`${classes.card} ${onClick ? classes.clickable : ''} ${selected ? classes.selected : ''} ${className ?? ''}`} onClick={handleClick}>
      <Card.Body>
        <Row>
          {!chatMessage && (
            <Col className="d-xl-none d-lg-none flex-grow-0 d-flex align-items-center">
              <BackButton onClick={onGoBack} />
            </Col>
          )}
          <Col className="flex-grow-0">
            <RoundedProfileImage imageUrl={profileImageUrl} width={50} height={50} />
          </Col>
          <Col className={`${!chatMessage ? 'd-flex align-items-center' : ''} ${classes.username_message_container}`}>
            <Row className={classes.username_container}>
              <Col className={classes.username_container}>
                <span className={classes.username_text}>{userName}</span>
              </Col>
            </Row>
            {chatMessage && (
              <Row>
                <Col className={classes.message_container}>
                  {showReplyIcon && <FontAwesomeIcon className={classes.reply_icon} icon={faReply} />}
                  <span>{chatMessage.message}</span>
                </Col>
              </Row>
            )}
          </Col>
          <Col md={4} className="d-flex justify-content-end">
            <span className={classes.sent_date_text}>{formattedSentDate}</span>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
};

export default ConversationCard;
