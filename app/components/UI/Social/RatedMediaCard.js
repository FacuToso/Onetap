import { useCallback, useMemo } from "react";
import { Card, Col, Row } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import classes from 'styles/rated-media-card.module.css'
import { CustomImage } from 'components';
import useScreenSize from 'hooks/useScreenSize';

const RatedMediaCard = ({ name, typeId, imgColSizes = {}, posterImageUrl, imageWidth = 150, imageHeight = 200, rating, onClick }) => {
  const { width } = useScreenSize();

  const starsSize = useMemo(() => {
    if (width >= 330) {
      return 40;
    }

    if (width >= 306) {
      return 35;
    }

    if (width >= 285) {
      return 30;
    }

    return 25;
  }, [width]);

  const handleClick = useCallback(() => {
    if (onClick) onClick({ typeId });
  }, [typeId, onClick]);

  return (
    <Card className={`${classes.card} ${onClick ? classes.clickable : ''}`} onClick={handleClick}>
      <Card.Body>
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
          <Col className={classes.text_container}>
            <h4>{name}</h4>
            {rating && (
              <div className={classes.rating_container}>
                <ReactStars
                  count={5}
                  value={rating}
                  size={starsSize}
                  disabled
                  isHalf
                  edit={false}
                />
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
};

export default RatedMediaCard;
