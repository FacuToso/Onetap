
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import classes from 'styles/back-button.module.css';

const BackButton = ({ onClick }) => {
  return (
    <Button className={classes.button} onClick={onClick}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </Button>
  );
};

export default BackButton;
