import { Card, Col, Row } from "react-bootstrap";
import RoundedProfileImage from "./RoundedProfileImage";
import classes from 'styles/user-card.module.css';
import { useCallback } from "react";

const UserCard = ({ className, userId, userName, profileImageUrl, onClick }) => {
    const handleClick = useCallback(() => {
        onClick(userId);
    }, [userId, onClick]);

    return (
        <Card className={`${classes.card} ${className ?? ''}`} onClick={handleClick}>
            <Card.Body>
                <Row className="align-items-center">
                    <Col className="flex-grow-0">
                        <RoundedProfileImage imageUrl={profileImageUrl} width={50} height={50} />
                    </Col>
                    <Col>
                        <span className={classes.username_text}>{userName}</span>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default UserCard;
