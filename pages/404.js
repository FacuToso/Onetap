
import { Col } from "react-bootstrap";
// Motion
import { motion } from "framer-motion";
import classes from "styles/404.module.css";
import Link from "next/link";

export default function Custom404() {
  return (
    <Col md={8} className={classes.container}>
      <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: 0, scale: [1, 1.1, 1], rotate: [0, 2, -2, 0] }}
      transition={{
        duration: 3,
        scale: {
          repeat: Infinity,
          duration: 5,
          delay: 3,
        },
        rotate: {
          repeat: Infinity,
          duration: 3,
          delay: 2,
        },
      }}
      className={classes.image} src="/images/404/404ghost.png" alt="404" />
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      ❌ 404 - Page Not Found ❌
      </motion.h1>
      {/* button to go back to home */}
      <motion.button
      whileHover={{ scale: 1.1 }}
      className={classes.button} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link className={classes.link} href="/">Go Back Home</Link>
      </motion.button>
    </Col>
  );
}
