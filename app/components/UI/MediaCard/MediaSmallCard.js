import { useCallback } from "react";
import classes from "styles/media-small-card.module.css";
import { motion } from "framer-motion";
import { CustomImage } from 'components';

const MediaSmallCard = ({
  id,
  type,
  posterImageUrl,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    const media = {
      id,
      type,
    };
    onClick(media);
  }, [id, type, onClick]);

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
    >
      <CustomImage
        className={classes.card}
        alt="Poster Image"
        src={posterImageUrl}
        width={200}
        height={250}
      />
    </motion.div>
  );
};

export default MediaSmallCard;
