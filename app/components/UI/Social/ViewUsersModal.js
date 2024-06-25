import { Modal } from "react-bootstrap";
import UserCard from "./UserCard";
import classes from 'styles/view-users-modal.module.css'

const ViewUsersModal = ({ visible, title, users, onClose, onUserClick }) => {
    return (
        <Modal className={classes.modal} show={visible} size="sm" onHide={onClose}>
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {users.map((user) => <UserCard key={user.userId} onClick={onUserClick} {...user} />)}
            </Modal.Body>
        </Modal>
    )
};

export default ViewUsersModal;
