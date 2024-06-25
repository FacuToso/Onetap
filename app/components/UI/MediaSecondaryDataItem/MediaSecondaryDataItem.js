import classes from "styles/media-summary.module.css";

const MediaSecondaryDataItem = ({ name, value }) => (
  <div className={classes.info_card}>
    <strong>{name}</strong>
    <p>{value}</p>
  </div>
);

export default MediaSecondaryDataItem;
