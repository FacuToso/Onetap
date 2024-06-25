import { Modal } from "react-bootstrap";
import ReactPlayer from 'react-player'
import classes from 'styles/play-video-modal.module.css';

const PlayVideoModal = ({visible, title, videoUrl, onClose }) => {
  return (
    <Modal className={classes.modal} size="xl" show={visible}>
      <Modal.Header closeButton closeVariant="white" onHide={onClose} className={classes.header}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={classes.player_wrapper}>
        <ReactPlayer
          className={classes.react_player}
          controls
          url={videoUrl}
          width="100%"
          height="calc(100vh - 100px)"
        />
      </Modal.Body>
    </Modal>
  );
};

export default PlayVideoModal;
