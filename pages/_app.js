import Layout from 'components/layout/Layout';
import { AuthContextProvider } from 'context/AuthContext';
import { SSRProvider } from 'react-bootstrap';
import { NotificationContainer } from "react-notifications";
import "styles/globals.css";
import "react-notifications/lib/notifications.css";
import 'react-circular-progressbar/dist/styles.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SSRProvider>
        <AuthContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContextProvider>
      </SSRProvider>
      <NotificationContainer />
    </>
  );
}

export default MyApp
