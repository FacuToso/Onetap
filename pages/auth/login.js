import { useCallback, useContext } from 'react';
import { AuthForm } from 'components';
import * as UserService from 'api/services/UserService';
import AuthContext from 'context/AuthContext';
import { useRouter } from 'next/router';
import classes from 'styles/auth.module.css';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = useCallback((form) => {
    return UserService.login(form)
      .then(({ token, userId, userName, profileImageUrl }) => {
        const userData = {
          userId,
          userName,
          profileImageUrl,
        };

        login(token, userData);
        router.push('/');
      });
  }, [router, login]);

  return (
    <section id="login" className={classes.container}>
      <motion.img
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1, x: 0, scale: [1, 0.95, 1]}}
      transition={{
        duration: 3,
        scale: {
          repeat: Infinity,
          duration: 10,
          delay: 3,
        },
      }}
      className={classes.image} src="/images/backgrounds/Stars.webp" />
      <AuthForm onSubmit={handleLogin} />
    </section>
  );
};

export default Login;
