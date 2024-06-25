import { useMemo } from "react";
import classes from 'styles/ad-box.module.css';
import { getRandomAd } from "utils/helpers";
import CustomImage from "../CustomImage/CustomImage";

const AdBox = ({ imageUrl, className }) => {
  const adImageUrl = useMemo(() => {
    if (imageUrl) return imageUrl;

    return getRandomAd();
  }, [imageUrl]);

  return (
    <div className={`${classes.container} ${className ?? ''}`}>
      <CustomImage
        className={classes.image_container}
        src={adImageUrl}
        alt="Ad Image"
        quality={100}
        fill
        sizes="100vw"
      />
      <h5>Ads</h5>
    </div>
  )
};

export default AdBox;
