import AuthContext from "context/AuthContext";
import { useContext, useCallback, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { RoundedProfileImage, LoadingSpinner } from 'components';
import classes from 'styles/social-create-tap.module.css';
import * as API from 'api/API';

const SocialSaveTap = ({ className, placeholder, respondingToTapId, editingTapId, initialContent = '', onProfileImageClick, onFinish }) => {
  const { isLoggedIn, profileImageUrl } = useContext(AuthContext);

  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);

  const handleSaveTap = useCallback(() => {
    setLoading(true);

    const save = async () => {
      if (editingTapId) {
        const rq = {
          content
        };

        return API.put(`social/tap/${editingTapId}`, rq);
      }

      const rq = {
        content,
        respondingToTapId,
      };

      return API.post('social/tap', rq);
    };

    save()
      .then(() => {
        setContent('');
        onFinish();
      })
      .finally(() => setLoading(false));
  }, [editingTapId, content, respondingToTapId, onFinish]);

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();

    handleSaveTap();
  }, [handleSaveTap]);

  const handleChangeContent = useCallback((e) => {
    const newValue = e.target.value;
    if (newValue.length <= 240) {
      setContent(newValue);
    }
  }, []);

  if (!isLoggedIn) return null;

  return (
    <div className={className}>
      {loading
        ? <LoadingSpinner />
        : (
          <>
            <Row className="d-flex align-items-center">
              <Col className="flex-grow-0">
                <RoundedProfileImage className={classes.image_container} onClick={onProfileImageClick} imageUrl={profileImageUrl} width={50} height={50} />
              </Col>
              <Col>
                <Form onSubmit={handleSubmitForm}>
                  <InputGroup >
                    <Form.Control
                      className={classes.searchInput}
                      as="textarea"
                      value={content}
                      onChange={handleChangeContent}
                      placeholder={placeholder || 'Tap whatever you want!'}
                    />
                    <Button type="submit" className={classes.searchBtn}>🎯 Tap!</Button>
                  </InputGroup>
                </Form>
              </Col>
            </Row>
            <Row>
              <Col className={classes.chars_left_container}>
                {content && <span className={`${classes.chars_left_span} ${content.length === 240 ? classes.no_chars_left : ''}`}>{240 - content.length} chars left</span>}
              </Col>
            </Row>
          </>
        )}
    </div>
  )
};

export default SocialSaveTap;
