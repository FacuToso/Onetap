import { MediaSmallCard } from "components";
import { Row, Col } from "react-bootstrap";
import classes from "styles/home-media-item.module.css";

const HomeMediaItem = ({ title, results, onMediaClick }) => {
  return (
    <Row className={classes.container}>
      <Row className="mt-3">
        <Col>
          <p className={classes.title}>{title}</p>
        </Col>
      </Row>
      <Row>
        <Col>
        <div className={classes.results_container}>
          {results.map((media) => (
            <MediaSmallCard key={media.id} {...media} onClick={onMediaClick} />
          ))}
        </div>
        </Col>
      </Row>
    </Row>
  );
};

export default HomeMediaItem;
