import AuthContext from "context/AuthContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import classes from 'styles/edit-profile-modal.module.css'
import * as API from 'api/API';
import { LoadingSpinner, RoundedProfileImage, ImagePicker } from "components";
import { NotificationManager } from "react-notifications";
import * as UserSocialConfigurationService from 'api/services/UserSocialConfigurationService';

const EditProfileModal = ({ visible, onClose }) => {
  const { updateUserData } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileColorCode1, setProfileColorCode1] = useState('#252525');
  const [profileColorCode2, setProfileColorCode2] = useState('#555555');
  const [profileSectionsAvailable, setProfileSectionsAvailable] = useState([]);
  const [selectedProfileSectionKeys, setSelectedProfileSectionKeys] = useState([]);
  const [profileHeaderImagesAvailable, setProfileHeaderImagesAvailable] = useState([]);
  const [selectedProfileHeaderImageUrl, setSelectedProfileHeaderImageUrl] = useState(null);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      Promise.all([
        API.get('/social/configuration'),
        API.get(`/social/user/configuration`),
      ])
        .then(([socialConfigurationResponse, userConfigurationResponse]) => {
          setProfileSectionsAvailable(socialConfigurationResponse.data.socialProfileSections);
          setProfileHeaderImagesAvailable(socialConfigurationResponse.data.socialProfileHeaderImages);

          setDescription(userConfigurationResponse.data.description || '');
          setProfileImageUrl(userConfigurationResponse.data.profileImageUrl);
          setProfileImageFile(null);
          setProfileColorCode1(userConfigurationResponse.data.profileColorCode1);
          setProfileColorCode2(userConfigurationResponse.data.profileColorCode2);
          setSelectedProfileSectionKeys(userConfigurationResponse.data.profileSectionKeys);
          setSelectedProfileHeaderImageUrl(userConfigurationResponse.data.profileHeaderImageUrl);
        })
        .finally(() => setLoading(false));

    }
  }, [visible]);

  const handleClose = useCallback(() => {
    onClose(false);
  }, [onClose]);

  const handleSave = useCallback(() => {
    setLoading(true);

    const save = async () => {
      if (profileImageFile) {
        // Upload Image file to AWS, and then update configuration sending the object key
        return UserSocialConfigurationService.uploadImageToAws(profileImageFile)
          .catch((error) => {
            NotificationManager.error('There was an error while uploading your Profile Image. Please try again later');
            throw error;
          })
          .then((awsObjectKey) => UserSocialConfigurationService.editProfile(description, selectedProfileSectionKeys, profileColorCode1, profileColorCode2, selectedProfileHeaderImageUrl, awsObjectKey));
      } else {
        // Just edit profile data (without changing User's Profile Image)
        return UserSocialConfigurationService.editProfile(description, selectedProfileSectionKeys, profileColorCode1, profileColorCode2, selectedProfileHeaderImageUrl);
      }
    }

    save()
      .then((response) => {
        if (profileImageFile) {
          // If user updated his profile image file, we'll need to update its URL locally (context and local storage)
          updateUserData({
            profileImageUrl: response.data.profileImageUrl,
          });
        }

        NotificationManager.success('Your profile configuration has been succesfully updated!');
        onClose(true);
      })
      .finally(() => setLoading(false));
  }, [profileImageFile, profileColorCode1, profileColorCode2, selectedProfileHeaderImageUrl, description, selectedProfileSectionKeys, onClose, updateUserData]);

  const handleChangeDescription = useCallback((e) => {
    const newValue = e.target.value;

    setDescription(newValue);
  }, []);

  const handleChangeProfileImageFile = useCallback((e) => {
    const newFile = e.target.files[0];
    setProfileImageFile(newFile);
  }, []);

  const handleSelectedProfileSectionsChange = useCallback((e) => {
    const key = e.target.id;

    setSelectedProfileSectionKeys((prevSelectedKeys) => {
      if (prevSelectedKeys.includes(key)) return prevSelectedKeys.filter((selectedKey) => selectedKey !== key);

      return [
        ...prevSelectedKeys,
        key,
      ];
    });
  }, []);

  const handleProfileColorCode1Change = useCallback((e) => {
    const newValue = e.target.value;

    setProfileColorCode1(newValue);
  }, []);

  const handleProfileColorCode2Change = useCallback((e) => {
    const newValue = e.target.value;

    setProfileColorCode2(newValue);
  }, []);

  const handleChangeSelectedProfileHeaderImageUrl = useCallback((imageUrl) => {
    setSelectedProfileHeaderImageUrl(imageUrl);
  }, [])

  return (
    <Modal className={classes.modal} show={visible} size="lg" onHide={handleClose}>
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Edit profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading
          ? <LoadingSpinner />
          : (
            <>
              <Row>
                <Col>
                  <Form>
                    <h4>Social Information</h4>
                    <Row>
                      <Col className="flex-grow-0 d-flex align-items-center">
                        <RoundedProfileImage imageUrl={profileImageFile ? URL.createObjectURL(profileImageFile) : profileImageUrl} width={100} height={100} />
                      </Col>
                      <Col>
                        <Form.Group>
                          <Form.Label className={classes.input_label}>Profile Image</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleChangeProfileImageFile}
                          />
                          <span className={classes.text_muted}>Accepted file types: .jpg and .png</span>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mt-3">
                      <Form.Label className={classes.input_label}>Description</Form.Label>
                      <Form.Control
                        value={description}
                        onChange={handleChangeDescription}
                        placeholder="My awesome description!"
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Form>
                    <h4>Profile Sections</h4>
                    {profileSectionsAvailable.map((section) => (
                      <Form.Check
                        key={section.key}
                        id={section.key}
                        type="checkbox"
                        label={section.title}
                        checked={selectedProfileSectionKeys.includes(section.key)}
                        onChange={handleSelectedProfileSectionsChange}
                      />
                    ))}
                  </Form>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Form>
                    <h4>Profile Colors</h4>
                    <Row className="d-flex justify-content-center">
                      <Col>
                        <Form.Group className={classes.profile_color_picker_form_group}>
                          <Form.Label className={classes.profile_color_label}>Profile Color 1</Form.Label>
                          <Form.Control
                            type="color"
                            value={profileColorCode1}
                            onChange={handleProfileColorCode1Change}
                          />
                        </Form.Group>
                      </Col>
                      <Col>
                        <Form.Group className={classes.profile_color_picker_form_group}>
                          <Form.Label className={classes.profile_color_label}>Profile Color 2</Form.Label>
                          <Form.Control
                            type="color"
                            value={profileColorCode2}
                            onChange={handleProfileColorCode2Change}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <Form>
                    <h4>Profile Header</h4>
                    <Row>
                      <Col>
                        <ImagePicker
                          images={profileHeaderImagesAvailable}
                          selectedImageUrl={selectedProfileHeaderImageUrl}
                          onChangeSelectedImage={handleChangeSelectedProfileHeaderImageUrl}
                        />
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col className="d-flex justify-content-end">
                  <Button variant="success" onClick={handleSave}>Save</Button>
                </Col>
              </Row>
            </>
          )}
      </Modal.Body>
    </Modal>
  )
};

export default EditProfileModal;
