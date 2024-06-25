import { useRouter } from "next/router";
import { Col, Row } from "react-bootstrap";
import { TapCard, SaveTapModal, LoadingSpinner, SocialLayout, ConfirmModal } from 'components';
import { useEffect, useContext, useState } from "react";
import * as API from 'api/API';
import AuthContext from 'context/AuthContext';
import { useCallback } from "react";
import classes from 'styles/tap-page.module.css';
import { NotificationManager } from "react-notifications";

const TapPage = () => {
  const { isLoggedIn, userId } = useContext(AuthContext);

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tap, setTap] = useState({
    tapId: null,
    content: null,
    user: {
      userId: null,
      userName: null,
      profileImageUrl: null,
    },
    createDate: null,
    responsesAmount: null,
    likes: [],
    tapRespondingTo: null,
    tapResponses: [],
  });
  const [saveTapModal, setSaveTapModal] = useState({
    visible: false,
    tapRespondingTo: null,
    editingTap: null,
  });
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    message: null,
    id: null,
  });

  const loadTap = useCallback(() => {
    if (router.query.id) {
      setLoading(true);

      API.get(`social/tap/${router.query.id}`)
        .then((response) => {
          setTap(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [router.query.id]);

  useEffect(() => {
    loadTap();
  }, [loadTap]);

  const handleSelectTap = useCallback((tapId) => {
    router.push(`/social/tap/${tapId}`);
  }, [router]);

  const handleRespondTap = useCallback((tapId) => {
    if (!isLoggedIn) {
      NotificationManager.error('Log in to respond Taps!');
      return;
    }

    setSaveTapModal({
      visible: true,
      tapRespondingTo: tap.tapResponses.find((tapResponse) => tapResponse.tapId === tapId) ?? tap, // if selected tap is not any of the tap responses, then it must be the main tap
      editingTap: null,
    });
  }, [isLoggedIn, tap]);

  const handleCloseSaveTapModal = useCallback((reload) => {
    setSaveTapModal({
      visible: false,
      tapRespondingTo: null,
      editingTap: null,
    });

    if (reload) {
      loadTap();
    }
  }, [loadTap]);

  const handleLikeTap = useCallback((tapId) => {
    if (!isLoggedIn) {
      NotificationManager.error('Log in to like Taps!');
      return;
    }

    // Checking whether we should like or unlike the Tap
    const clickedTap = tap.tapResponses.find((tapResponse) => tapResponse.tapId === tapId) ?? tap; // if liked tap is not any of the tap responses, then it must be the main tap
    let sendRequest;
    if (clickedTap.liked) {
      sendRequest = () => API.del(`social/tap/${tapId}/like`);
    } else {
      sendRequest = () => API.post(`social/tap/${tapId}/like`);
    }

    const getUpdatedTap = (currentTap) => {
      if (currentTap.tapId === tapId) {
        return {
          ...currentTap,
          liked: !currentTap.liked,
          likesAmount: currentTap.liked ? currentTap.likesAmount - 1 : currentTap.likesAmount + 1,
        };
      }

      return currentTap;
    };

    setTap((prevTap) => ({
      ...prevTap,
      tapResponses: prevTap.tapResponses.map(getUpdatedTap)
    }));

    sendRequest()
      .catch(() => setTap((prevTap) => ({
        ...prevTap,
        tapResponses: prevTap.tapResponses.map(getUpdatedTap)
      })));
  }, [isLoggedIn, tap]);

  const handleProfileImageClick = useCallback(({ userId }) => {
    router.push(`/social/user/${userId}`);
  }, [router]);

  const handleEditTap = useCallback((tapId) => {
    setSaveTapModal({
      visible: true,
      tapRespondingTo: null,
      editingTap: tap.tapResponses.find((tapResponse) => tapResponse.tapId === tapId) ?? tap, // if selected tap is not any of the tap responses, then it must be the main tap
    });
  }, [tap]);

  const handleDeleteTap = useCallback((tapId) => {
    setConfirmModal({
      visible: true,
      message: 'Are you sure you want to delete this Tap?',
      id: tapId,
    });
  }, []);

  const handleConfirmDeleteTap = useCallback((tapId) => {
    setLoading(true);
    API.del(`social/tap/${tapId}`)
      .then(() => {
        NotificationManager.success('Your tap was sucesfully deleted!');
        router.push('/social');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleCloseConfirmModal = useCallback((confirmed) => {
    const tapId = confirmModal.id;

    setConfirmModal({
      visible: false,
      message: null,
      id: null,
    });

    if (confirmed) handleConfirmDeleteTap(tapId);
  }, [confirmModal, handleConfirmDeleteTap]);

  return (
    <section id="tap-detail" className={classes.container}>
      {loading
        ? <LoadingSpinner />
        : (
          <div>
            <SocialLayout>
              <Row>
                <Col className={classes.taps_container}>
                  <TapCard className={classes.tap_main_card} {...tap} enableActions={userId === tap.user.userId} showAdditionalData onEdit={handleEditTap} onDelete={handleDeleteTap} onRespondTap={handleRespondTap} onLikeTap={handleLikeTap} onProfileImageClick={handleProfileImageClick} />
                </Col>
              </Row>
              <Row>
                <Col className={classes.response_taps_container}>
                  {tap.tapResponses.map((tapResponse) => (
                    <TapCard key={tapResponse.tapId} className={classes.tap_card} {...tapResponse} enableActions={userId === tap.user.userId} onEdit={handleEditTap} onDelete={handleDeleteTap} onSelectTap={handleSelectTap} onRespondTap={handleRespondTap} onLikeTap={handleLikeTap} onProfileImageClick={handleProfileImageClick} />
                  ))}
                </Col>
              </Row>
            </SocialLayout>
          </div>
        )}

      <SaveTapModal
        visible={saveTapModal.visible}
        tapRespondingTo={saveTapModal.tapRespondingTo}
        editingTap={saveTapModal.editingTap}
        onClose={handleCloseSaveTapModal}
      />
      <ConfirmModal visible={confirmModal.visible} message={confirmModal.message} onClose={handleCloseConfirmModal} />
    </section>
  );
};

export default TapPage;
