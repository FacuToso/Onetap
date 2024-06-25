import { SocialSaveTap, TapCard } from "components";
import { useCallback } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import classes from 'styles/create-tap-modal.module.css';

const SaveTapModal = ({ visible, tapRespondingTo, editingTap, onClose }) => {
  const handleTapSaved = useCallback(() => {
    onClose(true);
  }, [onClose]);

  if (!tapRespondingTo && !editingTap) return null;

  return (
    <Modal className={classes.modal} show={visible} size="md" onHide={onClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>{tapRespondingTo ? 'Responding Tap' : 'Editing Tap'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {tapRespondingTo && (
          <Row>
            <Col className={classes.tap_container}>
              <TapCard className={classes.tap_card} {...tapRespondingTo} disabled />
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <SocialSaveTap
              placeholder={tapRespondingTo ? 'Respond to that tap!' : 'Edit your Tap'} 
              respondingToTapId={tapRespondingTo?.tapId || null} 
              editingTapId={editingTap?.tapId || null}
              initialContent={editingTap?.content || ''}
              onFinish={handleTapSaved} 
            />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SaveTapModal;
