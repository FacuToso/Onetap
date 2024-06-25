import { TapCard, SaveTapModal, LoadingSpinner, SocialLayout, ConfirmModal } from 'components';
import classes from 'styles/social.module.css';
import { useCallback, useContext, useEffect, useState } from "react";
import * as API from 'api/API';
import AuthContext from "context/AuthContext";
import { NotificationManager } from "react-notifications";
import { useRouter } from "next/router";

// TODO: too much logic is being repeated in SocialPage - UserPage - TapPage. Check if we can somehow reuse it in those 3 places
const SocialPage = () => {
  const { userId, isLoggedIn } = useContext(AuthContext);

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [taps, setTaps] = useState([]);
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

  const loadFeed = useCallback(async () => {
    setLoading(true);
    return API.get('social/tap/feed')
      .then((response) => {
        setTaps(response.data.taps);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

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
      tapRespondingTo: taps.find((tap) => tap.tapId === tapId),
      editingTap: null,
    });
  }, [isLoggedIn, taps]);

  const handleCloseSaveTapModal = useCallback((reload) => {
    setSaveTapModal({
      visible: false,
      tapRespondingTo: null,
      editingTap: null,
    });

    if (reload) {
      loadFeed();
    }
  }, [loadFeed]);

  const handleLikeTap = useCallback((tapId) => {
    if (!isLoggedIn) {
      NotificationManager.error('Log in to like Taps!');
      return;
    }

    // Checking whether we should like or unlike the Tap
    const tap = taps.find((tap) => tap.tapId === tapId);
    let sendRequest;
    if (tap.liked) {
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

    setTaps((prevTaps) => prevTaps.map(getUpdatedTap));

    sendRequest()
      .catch(() => setTaps((prevTaps) => prevTaps.map(getUpdatedTap)));
  }, [isLoggedIn, taps]);

  const handleProfileImageClick = useCallback(({ userId }) => {
    router.push(`/social/user/${userId}`);
  }, [router]);

  const handleOwnProfileImageClick = useCallback(() => {
    handleProfileImageClick({ userId });
  }, [userId, handleProfileImageClick]);

  const handleSearchUsers = useCallback((searchText) => {
    router.push(`/social/search?query=${searchText}`);
  }, [router]);

  const handleEditTap = useCallback((tapId) => {
    setSaveTapModal({
      visible: true,
      tapRespondingTo: null,
      editingTap: taps.find((tap) => tap.tapId === tapId),
    });
  }, [taps]);

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
        return loadFeed();
      })
      .finally(() => setLoading(false));
  }, [loadFeed]);

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
    <section id="social-main" className={classes.container}>
      {loading
        ? <LoadingSpinner />
        : (
          <SocialLayout
            showSearch
            showCreateTap
            childrenContainerClassName={classes.taps_container}
            onTapCreated={loadFeed}
            onOwnProfileImageClick={handleOwnProfileImageClick}
            onSearchUsers={handleSearchUsers}
          >
            {taps.length === 0
              ? <p>There are currently no taps for you to read. Follow some Users to get started!</p>
              : taps.map((tap) => <TapCard className={classes.tap_card} key={tap.tapId} {...tap} enableActions={userId === tap.user.userId} onEdit={handleEditTap} onDelete={handleDeleteTap} onSelectTap={handleSelectTap} onRespondTap={handleRespondTap} onLikeTap={handleLikeTap} onProfileImageClick={handleProfileImageClick} />)
            }
          </SocialLayout>
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

export default SocialPage;
