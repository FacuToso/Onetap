import { Col, Row } from "react-bootstrap";
import { MediaSmallCard } from "components";
import classes from "styles/user-media-recommendation.module.css";
import { motion } from "framer-motion";
import { randomEmoji, randomPhrase } from "./helpers";
import { useMemo } from "react";

const BackColor = `-webkit-linear-gradient(0deg, #c80442 5%, #fe0058 50%)`;

const UserMediaRecommendation = ({ recommendedBy, recommendations, onMediaClick }) => {
  const emoji = useMemo(() => randomEmoji(), []);
  const phrase = useMemo(() => randomPhrase(), []);

  return (
    <Row className={classes.container}>
      <Row className="mt-3">
        <Col>
          <p className={classes.recommendation_text}>
            {emoji} Because of{" "}
            <motion.span
              style={{
                fontWeight: "bold",
                background: BackColor,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className={classes.recommendation_text_bold}
            >
              {recommendedBy},
            </motion.span>{" "}
            {phrase}
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className={classes.recommendations_container}>
            {recommendations.map((recommendation, index) => (
              <MediaSmallCard
                key={index}
                {...recommendation}
                onClick={onMediaClick}
              />
            ))}
          </div>
        </Col>
      </Row>
    </Row>
  );
};

export default UserMediaRecommendation;
