import { Button, Card, Col, Row } from "react-bootstrap";
import { RoundedProfileImage, UserCombo, BackButton } from "components";
import classes from 'styles/pick-recipient-form.module.css';

const customSelectStyles = {
  option: (styles, { isFocused }) => ({
    ...styles,
    borderColor: '#2f1755',
    color: 'white',
    backgroundColor: isFocused ? '#402f5a' : '#2f1755',
  }),
  valueContainer: (styles) => ({
    ...styles,
    borderColor: '#2f1755',
    backgroundColor: '#2f1755',
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: '#2f1755',
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    backgroundColor: '#2f1755',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'white',
  }),
  control: (styles) => ({
    ...styles,
    borderColor: '#402f5a',
    backgroundColor: 'inherit',
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: '#402f5a',
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
    backgroundColor: '#402f5a',
  }),
};

const PickRecipientForm = ({ recipient, onRecipientChange, onGoBack, ignoreIds }) => {
  return (
    <Card className={classes.card}>
      <Card.Body>
        <Row>
          <Col>
            <h5>New Message</h5>
          </Col>
        </Row>
        <Row>
          <Col className="d-xl-none d-lg-none flex-grow-0 d-flex align-items-center">
            <BackButton onClick={onGoBack} />
          </Col>
          <Col className="flex-grow-0">
            <RoundedProfileImage imageUrl={recipient?.profileImageUrl} width={50} height={50} />
          </Col>
          <Col className="pt-2">
            <UserCombo
              value={recipient}
              onChange={onRecipientChange}
              ignoreIds={ignoreIds}
              customSelectStyles={customSelectStyles}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
};

export default PickRecipientForm;
