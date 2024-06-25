import { Card, Row, Col } from "react-bootstrap";
import classes from 'styles/message-card.module.css';
import { RoundedProfileImage } from 'components';

const MessageCard = ({ received, userName, profileImageUrl, message, sentDate }) => {
  return (
    <Card className={`${classes.card} ${received ? classes.received_message_card : classes.sent_message_card}`}>
      <Card.Body className={classes.card_body}>
        <Row>
          <Col className="flex-grow-0 d-flex align-items-center">
            <RoundedProfileImage className={classes.image_container} imageUrl={profileImageUrl} width={50} height={50} />
          </Col>
          <Col className="d-flex">
            <Row>
              <Col className={classes.message_container}>
                <span>{message}</span>
              </Col>
            </Row>
          </Col>
          <Col md={4} className={classes.sent_date_container}>
            <span className={classes.sent_date_text}>
              {new Date(sentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              {' - '}
              {new Date(sentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default MessageCard;
