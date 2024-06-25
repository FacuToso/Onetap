import { useCallback } from "react";
import { Button, Modal } from "react-bootstrap";
import classes from 'styles/confirm-modal.module.css';

const ConfirmModal = ({ visible, message, onClose }) => {
  const handleConfirmClick = useCallback(() => {
    onClose(true);
  }, [onClose]);

  const handleCancelClick = useCallback(() => {
    onClose(false);
  }, [onClose]);

  return (
    <Modal className={classes.modal} show={visible}>
      <Modal.Header>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>{message}</span>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleCancelClick}>Cancel</Button>
        <Button variant="success" onClick={handleConfirmClick}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  )
};

export default ConfirmModal;
