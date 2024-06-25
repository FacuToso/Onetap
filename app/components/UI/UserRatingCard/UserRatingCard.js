import { useCallback } from "react";
import { Card } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import classes from 'styles/user-rating-card.module.css';
import { RoundedProfileImage } from "components";

const UserRatingCard = ({ userId, profileImageUrl, userName, rating, size = 40, onClick }) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(userId);
    }
  }, [userId, onClick]);

  return (
    <Card className={`${classes.card} ${onClick ? classes.clickable : ''}`} onClick={handleClick}>
      <Card.Img className="mt-3" as={RoundedProfileImage} variant="top" imageUrl={profileImageUrl} alt="Profile Picture" width={100} height={100} />
      <Card.Body className={classes.card_body}>
        <h6>{userName}</h6>
        <ReactStars
          count={5}
          value={rating}
          size={size}
          disabled
          isHalf
          edit={false}
        />
      </Card.Body>
    </Card>
  );
};

export default UserRatingCard;
