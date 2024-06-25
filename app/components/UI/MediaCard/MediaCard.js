import { useCallback } from "react";
import { Row, Col, Card } from "react-bootstrap";
import classes from 'styles/media-card.module.css';
import { CustomImage, VoteAverage } from 'components';

const MediaCard = ({ id, type, imgColSizes = {}, name, overview, releaseDate, posterImageUrl, imageWidth = 200, imageHeight = 250, voteAverage, className, infoContainerClassName, showVoteAverage, onClick }) => {
  const handleClick = useCallback(() => {
    const media = {
      id,
      type,
      typeId: `${type}_${id}`
    };
    onClick(media);
  }, [id, type, onClick]);

  return (
    <Card className={`${classes.card} ${onClick ? classes.clickable : ''} ${className ?? ''}`} onClick={handleClick}>
      <Row>
        <Col
          xl={imgColSizes.xl}
          lg={imgColSizes.lg}
          md={imgColSizes.md}
          sm={imgColSizes.sm}
          xs={imgColSizes.xs}
          className={classes.image_container}
        >
          <CustomImage
            className={classes.image}
            alt="Poster Image"
            src={posterImageUrl}
            width={imageWidth}
            height={imageHeight}
          />
        </Col>
        <Col className={`${classes.info_container} ${infoContainerClassName ?? ''}`}>
          <Row>
            <Col>
              <h4>{name}</h4>
              <div>
                <p className={classes.release_date_text}>{releaseDate ? new Date(releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No Release Date'}</p>
                <p>{overview}</p>
              </div>
            </Col>
          </Row>
          {showVoteAverage && (
            <Row className={classes.vote_average_row}>
              <Col className={classes.vote_average_column}>
                <div className={classes.vote_average_container}>
                  <VoteAverage voteAverage={voteAverage} />
                </div>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Card >
  );
};

export default MediaCard;
