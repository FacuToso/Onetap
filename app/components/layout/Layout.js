import Head from 'next/head';
import CustomNavbar from './CustomNavbar';
import classes from 'styles/layout.module.css';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>OneTap</title>
        <meta property="og:url" content="https://www.onetaphub.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="OneTap" />
        <meta
          property="description"
          content="Search for your favorite Movies and TV Shows with OneTap."
        />
        <meta
          property="og:description"
          content="Search for your favorite Movies and TV Shows with OneTap."
        />
        <meta
          property="og:image"
          content="https://onetaphub.com/images/backgrounds/onetap_large_background.webp"
        />
        <meta property="og:site_name" content="OneTap" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="onetaphub.com" />
        <meta property="twitter:url" content="https://www.onetaphub.com/" />
        <meta name="twitter:title" content="OneTap" />
        <meta
          name="twitter:description"
          content="Search for your favorite Movies and TV Shows with OneTap."
        />
        <meta
          name="twitter:image"
          content="https://onetaphub.com/images/backgrounds/onetap_large_background.webp"
        />
      </Head>
      <CustomNavbar />
      {router.pathname === '/'
        ? children
        : (
          <div className={classes.container}>
            {children}
          </div>
        )}
    </>
  );
};

export default Layout;