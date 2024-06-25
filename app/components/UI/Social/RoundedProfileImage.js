import classes from 'styles/rounded-profile-image.module.css';
import { useCallback } from "react";
import { CustomImage } from 'components';

const RoundedProfileImage = ({ imageUrl, width, height, className, onClick }) => {
  const handleClick = useCallback((e) => {
    if (onClick) e.stopPropagation();

    if (onClick) {
      onClick(imageUrl)
    }
  }, [onClick, imageUrl]);

  return (
    <div className={`${className || ''} ${onClick ? classes.clickable : ''}`} onClick={handleClick}>
      <CustomImage
        className={classes.tap_author_image}
        alt="Profile Image"
        src={imageUrl}
        width={width}
        height={height}
        noImageFallback="/images/user/user-no-profile-image.webp"
      />
    </div>
  )
};

export default RoundedProfileImage;
