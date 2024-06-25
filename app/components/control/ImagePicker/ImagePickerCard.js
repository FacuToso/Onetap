import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { Card } from "react-bootstrap";
import classes from 'styles/image-picker-card.module.css';

const ImagePickerCard = ({ imageUrl, selected, onSelect }) => {
  const handleSelect = useCallback(() => {
    if (!selected) {
      onSelect(imageUrl);
    }
  }, [selected, imageUrl, onSelect]);

  return (
    <Card className={`${classes.card} ${!selected ? classes.clickable : ''}`} onClick={handleSelect}>
      {selected && <FontAwesomeIcon className={classes.selected_icon} color="lightgreen" icon={faCheck} />}
      <Card.Img variant="top" src={imageUrl} alt="Image" height={175} />
    </Card>
  )
};

export default ImagePickerCard;
