import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "styles/media-summary.module.css";
import { motion } from "framer-motion";

// const backgroundColor = `-webkit-linear-gradient(0deg, #c80442 5%, #fe0058 50%)`;

const SocialMediaLink = ({ href, icon, bckColor }) => (
  <motion.a href={href} target="_blank" rel="noreferrer" className={classes.media_icon}
  style={{background: bckColor}}
  whileHover={{ scale: 1.1 }}
  >
    <FontAwesomeIcon icon={icon} className={classes.icon_class} />
  </motion.a> 
);

export default SocialMediaLink