import { motion } from "framer-motion";
import { Card } from "react-bootstrap";
import classes from "styles/cast-card.module.css";

const CastCard = ({ name, character, profileImageUrl }) => {
  return (
      <Card className={classes.card}>
        <Card.Img
          className={classes.image}
          variant="top"
          src={profileImageUrl || "/images/general/no-image-available.webp"}
          alt="Profile Picture"
          height={175}
        />
        <Card.Body className={classes.card_body}>
          <h6>{name}</h6>
          <p className={classes.character_text}>{character}</p>
        </Card.Body>
      </Card>
  );
};

export default CastCard;
