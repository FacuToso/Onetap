import RatedMediaCard from "../Social/RatedMediaCard";

const UserMediaRelationCard = ({ isFavorite, isInWatchLater, mediaInfo }) => {
  return (
    <RatedMediaCard {...mediaInfo} />
  );
};

export default UserMediaRelationCard;
