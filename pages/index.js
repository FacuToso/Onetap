import { CustomImage, SearchBox } from 'components';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

// Motion
import { motion } from "framer-motion";

// Styles
import styles from "styles/landing.module.css";

// Hooks
import { useScrollPosition } from "hooks/useScrollPosition";
import Link from 'next/link';

export default function Landing() {
  const router = useRouter();

  const scrollPosition = useScrollPosition();

  const handleSearch = useCallback((searchText) => {
    router.push(`/media/search?query=${searchText}`);
  }, [router]);

  return (
    <div className={styles.background}>
      <section
        className={styles.main__section}
        style={scrollPosition > 0 ? { top: scrollPosition * 0.5 + "px" } : {}}
      >
        <motion.div
          className={styles.divImg}
          style={
            scrollPosition > 0 ? { left: scrollPosition * 0.75 + "px" } : {}
          }
          initial={{ x: 300, scale: 1 }}
          transition={{
            duration: 3,
            scale: {
              repeat: Infinity,
              duration: 8,
              delay: 1,
            },
          }}
          animate={{ x: 0, scale: [1, 1.05, 1] }}
        >
          <CustomImage
            className={styles.background_images}
            src={"/images/backgrounds/Stars.webp"}
            alt="Background Image - Stars"
            quality={75}
            noPlaceholder
            fill
          />
        </motion.div>
        <motion.div
          className={styles.divImg}
          id={styles["moon"]}
          style={scrollPosition > 0 ? { top: scrollPosition * 0.8 + "px" } : {}}
          initial={{ x: 500 }}
          transition={{
            duration: 3,
            scale: {
              repeat: Infinity,
              duration: 5,
              delay: 3,
            },
          }}
          animate={{ x: 0, scale: [1, 1.1, 1] }}
        >
          <CustomImage
            className={styles.background_images}
            src={"/images/backgrounds/Moon.webp"}
            alt="Background Image - Moon"
            quality={75}
            noPlaceholder
            fill
          />
        </motion.div>
        <motion.div
          className={styles.divImg}
          style={scrollPosition > 0 ? { top: scrollPosition * 0.8 + "px" } : {}}
          initial={{ y: 600 }}
          transition={{ duration: 1.5 }}
          animate={{ y: 0 }}
        >
          <CustomImage
            className={styles.background_images}
            src={"/images/backgrounds/MountainsBehind.webp"}
            alt="Background Image - Mountains Behind"
            quality={75}
            noPlaceholder
            fill
          />
        </motion.div>
        <motion.div
          className={styles.search_box_container}
          style={scrollPosition > 0 ? { marginTop: scrollPosition * 0.1 + "px" } : {}}
          initial={{ y: 500, scale: 1.0 }}
          transition={{ duration: 5, type: "spring", stiffness: 15 , 
          scale: {
            repeat: Infinity,
            duration: 5,
            delay: 3,
          } }}
          animate={{ y: 0, duration: 2.5 , scale: [1.4, 1.5, 1.4] }}
        >
          <SearchBox
            className={styles.search_box}
            placeholder="Search Media"
            onSearch={handleSearch}
            width={300}
          />
        </motion.div>
        <motion.div
          className={styles.divImg}
          style={scrollPosition > 0 ? { top: scrollPosition * 0.4 + "px" } : {}}
          initial={{ y: 500 }}
          transition={{ duration: 1.8 }}
          animate={{ y: 0 }}
        >
          <CustomImage
            className={styles.background_images}
            src={"/images/backgrounds/MountainsFront.webp"}
            alt="Background Image - Mountains Front"
            quality={75}
            noPlaceholder
            fill
          />
        </motion.div>
      </section>
      <section id="description" className={styles.desc}>
        <h2>OneTap</h2>
        <motion.h3 whileHover={{ scale: 1.05 }}>📓 Who are we?</motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [-300, 0] }}
          viewport={{ once: true }}
        >
          We are a group of true Movies and TV Series lovers, that enjoy watching
          and talking about new media that comes out. Because of this, we were used
          to face the issue of not knowing where to watch our favorite media due to
          the extremely large amount of streaming services on the market.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [-300, 0] }}
          viewport={{ once: true }}
        >
          We always wanted a platform that unified all streaming services in one
          place, allowing users to find out when, how and where they will be able to
          enjoy their favorite media, in a fast and convenient way.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [-300, 0] }}
          viewport={{ once: true }}
        >
          After a long time waiting for it and noone being able to create a platform like that one, we decided
          to make it ourselves.
        </motion.p>

        <motion.h3
          initial={{ textAlign: "right" }}
          whileHover={{ scale: 1.05 }}
        >
          📺 All Streaming Providers in one place
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [300, 0] }}
          viewport={{ once: true }}
        >
          We know firsthand that the huge amount of streaming providers on the market nowadays
          makes it a struggle to know where to watch your favorite media. That&apos;s why we 
          decided to provide you the ability of searching for every movie or TV series you can
          imagine in only one place, <strong>OneTap</strong>.
        </motion.p>

        <motion.h3 whileHover={{ scale: 1.05 }}>
          🤝 Share with your friends
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [-300, 0] }}
          viewport={{ once: true }}
        >
          OneTap also provides Media lovers a space in which they can interact with each other by
          creating Taps, reading other users ones, sending messages via our own private Chat service and
          even sharing comments and ratings that can be seen by the user&apos;s friends.
        </motion.p>

        <motion.h3
          initial={{ textAlign: "right" }}
          whileHover={{ scale: 1.05 }}
        >
          ▶️ Combine your Watch Lists
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1, x: [300, 0] }}
          viewport={{ once: true }}
        >
          Forget about having tons of Watch Lists, one for each streaming service.
          With OneTap, you&apos;ll be able to save every Media you want to your Watch-Later 
          or Favorites list, no matter which streaming service provides it. This is definetely 
          the best way to keep track of the Media you want to watch, or even share with others
          your favorite Media.
        </motion.p>
      </section>
    </div>
  );
}
