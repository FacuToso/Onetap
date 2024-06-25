import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { Button, Col, Row } from "react-bootstrap";
import {
  RoundedProfileImage,
  CustomTabs,
  TapCard,
  LoadingSpinner,
  SaveTapModal,
  ViewUsersModal,
  RatedMediaCard,
  MediaCard,
  EditProfileModal,
  CustomImage,
  ConfirmModal,
} from "components";
import * as API from "api/API";
import classes from "styles/user-profile.module.css";
import AuthContext from "context/AuthContext";
import { NotificationManager } from "react-notifications";
import { SocialProfileSectionKey } from "utils/consts";
import { motion } from "framer-motion";

const mediaCardImgColSizes = {
  xl: 3,
  lg: 4,
  md: 5,
  sm: 6,
};

const UserPage = () => {
  const { userId, userName, profileImageUrl, isLoggedIn } =
    useContext(AuthContext);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    userId: null,
    userName: null,
    profileImageUrl: null,
    description: null,
    profileHeaderImageUrl: null,
    taps: [],
    followers: [],
    following: [],
    userTapsLiked: [],
    ratings: [],
    favorites: [],
    profileSections: [],
  });
  const [activeKey, setActiveKey] = useState(null);
  const [saveTapModal, setSaveTapModal] = useState({
    visible: false,
    tapRespondingTo: null,
    editingTap: null,
  });
  const [viewUsersModal, setViewUsersModal] = useState({
    visible: false,
    users: [],
    title: null,
  });
  const [editProfileModal, setEditProfileModal] = useState({ visible: false });
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    message: null,
    id: null,
  });

  const currentlyFollowingUser = useMemo(() => {
    return (
      isLoggedIn &&
      userProfile.followers.some((follower) => follower.userId === userId)
    );
  }, [isLoggedIn, userId, userProfile.followers]);

  const loadProfile = useCallback(async () => {
    if (router.query.id) {
      setLoading(true);
      return API.get(`social/user/${router.query.id}`)
        .then((response) => {
          setUserProfile(response.data);
          setActiveKey(response.data.profileSections[0]?.key);
        })
        .finally(() => setLoading(false));
    }

    return Promise.resolve();
  }, [router.query.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSelectTap = useCallback(
    (tapId) => {
      router.push(`/social/tap/${tapId}`);
    },
    [router]
  );

  const handleRespondTap = useCallback(
    (tapId) => {
      if (!isLoggedIn) {
        NotificationManager.error("Log in to respond Taps!");
        return;
      }

      setSaveTapModal({
        visible: true,
        tapRespondingTo:
          userProfile.taps.find((tap) => tap.tapId === tapId) ??
          userProfile.userTapsLiked.find((tap) => tap.tapId === tapId),
        editingTap: null,
      });
    },
    [isLoggedIn, userProfile.taps, userProfile.userTapsLiked]
  );

  const handleCloseSaveTapModal = useCallback(
    (reload) => {
      setSaveTapModal({
        visible: false,
        tapRespondingTo: null,
        editingTap: null,
      });

      if (reload) {
        loadProfile();
      }
    },
    [loadProfile]
  );

  const handleLikeTap = useCallback(
    (tapId) => {
      if (!isLoggedIn) {
        NotificationManager.error("Log in to like Taps!");
        return;
      }

      // Checking whether we should like or unlike the Tap
      const tap =
        userProfile.taps.find((tap) => tap.tapId === tapId) ??
        userProfile.userTapsLiked.find((tap) => tap.tapId === tapId);
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
            likesAmount: currentTap.liked
              ? currentTap.likesAmount - 1
              : currentTap.likesAmount + 1,
          };
        }

        return currentTap;
      };

      setUserProfile((prevUserProfile) => ({
        ...prevUserProfile,
        taps: prevUserProfile.taps.map(getUpdatedTap),
        userTapsLiked: prevUserProfile.userTapsLiked.map(getUpdatedTap),
      }));

      sendRequest().catch(() =>
        setUserProfile((prevUserProfile) => ({
          ...prevUserProfile,
          taps: prevUserProfile.taps.map(getUpdatedTap),
          userTapsLiked: prevUserProfile.userTapsLiked.map(getUpdatedTap),
        }))
      );
    },
    [isLoggedIn, userProfile.taps, userProfile.userTapsLiked]
  );

  const handleMediaCardClicked = useCallback(
    ({ typeId }) => {
      router.push(`/media/${typeId}`);
    },
    [router]
  );

  const handleEditTap = useCallback(
    (tapId) => {
      setSaveTapModal({
        visible: true,
        tapRespondingTo: null,
        editingTap:
          userProfile.taps.find((tap) => tap.tapId === tapId) ??
          userProfile.userTapsLiked.find((tap) => tap.tapId === tapId),
      });
    },
    [userProfile.taps, userProfile.userTapsLiked]
  );

  const handleDeleteTap = useCallback((tapId) => {
    setConfirmModal({
      visible: true,
      message: "Are you sure you want to delete this Tap?",
      id: tapId,
    });
  }, []);

  const handleConfirmDeleteTap = useCallback(
    (tapId) => {
      setLoading(true);
      API.del(`social/tap/${tapId}`)
        .then(() => {
          NotificationManager.success("Your tap was sucesfully deleted!");
          return loadProfile();
        })
        .finally(() => setLoading(false));
    },
    [loadProfile]
  );

  const handleCloseConfirmModal = useCallback(
    (confirmed) => {
      const tapId = confirmModal.id;

      setConfirmModal({
        visible: false,
        message: null,
        id: null,
      });

      if (confirmed) handleConfirmDeleteTap(tapId);
    },
    [confirmModal, handleConfirmDeleteTap]
  );

  const profileTabs = useMemo(
    () =>
      userProfile.profileSections.map((profileSection) => {
        const tabObject = {
          key: profileSection.key,
          title: profileSection.title,
          render: () => null,
        };

        switch (profileSection.key) {
          case SocialProfileSectionKey.TAPS:
            tabObject.render = () =>
              userProfile.taps.map((tap) => (
                <TapCard
                  key={tap.tapId}
                  className={classes.tap_card}
                  {...tap}
                  enableActions={userId === tap.user.userId}
                  onEdit={handleEditTap}
                  onDelete={handleDeleteTap}
                  onSelectTap={handleSelectTap}
                  onRespondTap={handleRespondTap}
                  onLikeTap={handleLikeTap}
                />
              ));
            break;
          case SocialProfileSectionKey.LIKES:
            tabObject.render = () =>
              userProfile.userTapsLiked.map((tap) => (
                <TapCard
                  key={tap.tapId}
                  className={classes.tap_card}
                  {...tap}
                  enableActions={userId === tap.user.userId}
                  onEdit={handleEditTap}
                  onDelete={handleDeleteTap}
                  onSelectTap={handleSelectTap}
                  onRespondTap={handleRespondTap}
                  onLikeTap={handleLikeTap}
                />
              ));
            break;
          case SocialProfileSectionKey.RATINGS:
            tabObject.render = () =>
              userProfile.ratings.map((rating) => (
                <RatedMediaCard
                  key={rating.typeId}
                  imageWidth={150}
                  imageHeight={187}
                  imgColSizes={mediaCardImgColSizes}
                  {...rating}
                  onClick={handleMediaCardClicked}
                />
              ));
            break;
          case SocialProfileSectionKey.FAVORITES:
            tabObject.render = () =>
              userProfile.favorites.map((favoriteMedia) => (
                <MediaCard
                  key={favoriteMedia.id}
                  className={classes.media_card}
                  imageWidth={150}
                  imageHeight={187}
                  imgColSizes={mediaCardImgColSizes}
                  {...favoriteMedia}
                  onClick={handleMediaCardClicked}
                />
              ));
            break;
          default:
            break;
        }

        return tabObject;
      }),
    [
      userProfile.profileSections,
      userProfile.taps,
      userProfile.userTapsLiked,
      userProfile.ratings,
      userProfile.favorites,
      userId,
      handleEditTap,
      handleDeleteTap,
      handleSelectTap,
      handleRespondTap,
      handleLikeTap,
      handleMediaCardClicked,
    ]
  );

  const handleActiveKeyChange = useCallback((newActiveKey) => {
    setActiveKey(newActiveKey);
  }, []);

  const handleViewFollowing = useCallback(() => {
    setViewUsersModal({
      visible: true,
      users: userProfile.following,
      title: "Following",
    });
  }, [userProfile.following]);

  const handleViewFollowers = useCallback(() => {
    setViewUsersModal({
      visible: true,
      users: userProfile.followers,
      title: "Followers",
    });
  }, [userProfile.followers]);

  const handleCloseViewUsersModal = useCallback(() => {
    setViewUsersModal({ visible: false, users: [], title: null });
  }, []);

  const handleUserClick = useCallback(
    (userId) => {
      handleCloseViewUsersModal();
      router.push(`/social/user/${userId}`);
    },
    [router, handleCloseViewUsersModal]
  );

  const handleFollowUnfollowUser = useCallback(() => {
    if (!isLoggedIn) {
      NotificationManager.error("Log in to follow Users!");
      return;
    }
    const following = !currentlyFollowingUser;

    let sendRequest;
    if (following) {
      sendRequest = () => API.post(`social/user/${userProfile.userId}/follow`);
    } else {
      sendRequest = () => API.del(`social/user/${userProfile.userId}/follow`);
    }

    const getUpdatedUserProfile = (profile, following) => {
      let newFollowers;
      if (following) {
        // If we are following, we'll manually add our user to the current user followers
        newFollowers = [
          ...profile.followers,
          {
            userId,
            userName,
            profileImageUrl: profileImageUrl,
          },
        ];
      } else {
        // If we are unfollowing, we'll remove our user from the current user followers
        newFollowers = profile.followers.filter(
          (follower) => follower.userId !== userId
        );
      }

      return {
        ...profile,
        followers: newFollowers,
      };
    };

    setUserProfile((prevState) => getUpdatedUserProfile(prevState, following));

    sendRequest().catch(() =>
      setUserProfile((prevState) =>
        getUpdatedUserProfile(prevState, !following)
      )
    );
  }, [
    isLoggedIn,
    userId,
    userName,
    profileImageUrl,
    currentlyFollowingUser,
    userProfile.userId,
  ]);

  const handleEditProfile = useCallback(() => {
    setEditProfileModal({ visible: true });
  }, []);

  const handleCloseEditProfileModal = useCallback(
    (reload) => {
      setEditProfileModal({ visible: false });
      if (reload) loadProfile();
    },
    [loadProfile]
  );

  const cardBackColor =
    "linear-gradient(90deg, " +
    userProfile.profileColorCode1 +
    " , " +
    userProfile.profileColorCode2 +
    ")";

  return (
    <Col
      sm={12}
      md={10}
      lg={8}
      xl={8}
      id="user-profile"
      className={classes.container}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <motion.div
          className={`${classes.data_container} ${userProfile.profileHeaderImageUrl ? "" : "pt-3"
            }`}
          style={{ background: cardBackColor }}
        >
          {userProfile.profileHeaderImageUrl && (
            <Row>
              <Col>
                <motion.div
                  initial={{ y: -200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CustomImage
                    className={classes.header_image}
                    src={userProfile.profileHeaderImageUrl}
                    alt="Header Image"
                    width={1000}
                    height={300}
                    layout="responsive"
                  />
                </motion.div>
              </Col>
            </Row>
          )}
          <Row>
            <Col className={classes.edit_btn_container}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className={classes.edit_btn}
              >
                {userId === userProfile.userId ? (
                  <Button
                    className={classes.header_button}
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Button
                    variant={currentlyFollowingUser ? "danger" : "primary"}
                    className={classes.header_button}
                    onClick={handleFollowUnfollowUser}
                  >
                    {currentlyFollowingUser ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </motion.div>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-center">
              <motion.div
                initial={{ y: -200 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RoundedProfileImage
                  className={classes.profile_image}
                  imageUrl={userProfile.profileImageUrl}
                  width={150}
                  height={150}
                />
              </motion.div>
            </Col>
          </Row>
          <div className={classes.header_container}></div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Row>
              <Col>
                <p className={classes.username_text}>@{userProfile.userName}</p>
              </Col>
            </Row>
            {userProfile.description && (
              <Row>
                <Col>
                  <p className="text-center">{userProfile.description}</p>
                </Col>
              </Row>
            )}
            <Row>
              <Col className={`text-end ${classes.relations_column}`}>
                <Button
                  style={{
                    backgroundColor: userProfile.profileColorCode1,
                    borderColor: "white",
                  }}
                  onClick={handleViewFollowing}
                >
                  {userProfile.following.length} Following
                </Button>
              </Col>
              <Col className={classes.relations_column}>
                <Button
                  style={{
                    backgroundColor: userProfile.profileColorCode2,
                    borderColor: "white",
                  }}
                  onClick={handleViewFollowers}
                >
                  {userProfile.followers.length} Followers
                </Button>
              </Col>
            </Row>
          </motion.div>
          <Row className="mt-3 p-3">
            <Col>
              <motion.div
                initial={{ y: 500, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <CustomTabs
                  id="profile-tabs"
                  tabs={profileTabs}
                  activeKey={activeKey}
                  onSelectActiveKey={handleActiveKeyChange}
                  fill
                />
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      )}

      <SaveTapModal
        visible={saveTapModal.visible}
        tapRespondingTo={saveTapModal.tapRespondingTo}
        editingTap={saveTapModal.editingTap}
        onClose={handleCloseSaveTapModal}
      />
      <ViewUsersModal
        visible={viewUsersModal.visible}
        users={viewUsersModal.users}
        title={viewUsersModal.title}
        onUserClick={handleUserClick}
        onClose={handleCloseViewUsersModal}
      />
      <EditProfileModal
        visible={editProfileModal.visible}
        onClose={handleCloseEditProfileModal}
      />
      <ConfirmModal
        visible={confirmModal.visible}
        message={confirmModal.message}
        onClose={handleCloseConfirmModal}
      />
    </Col>
  );
};

export default UserPage;
