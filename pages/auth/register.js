import { useCallback } from 'react';
import { AuthForm } from 'components';
import * as UserService from 'api/services/UserService';
import { NotificationManager } from "react-notifications";
import { useRouter } from 'next/router';
import classes from 'styles/auth.module.css';
import {motion} from 'framer-motion';

const Register = () => {
  const router = useRouter();

  const handleRegister = useCallback((form) => {
    return UserService.register(form)
      .then(() => {
        NotificationManager.success('You successfully registered yourself in the App. Please login with the credentials you used');
        router.push('/auth/login');
      });
  }, [router]);

  return (
    <section id="register" className={classes.container}>
      <motion.img
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1, x: 0, scale: [1, 0.95, 1]}}
      transition={{
        duration: 1,
        scale: {
          repeat: Infinity,
          duration: 10,
          delay: 3,
        },
      }}
      className={classes.image} src="/images/backgrounds/Stars.webp" />
      <AuthForm registerMode onSubmit={handleRegister} />
    </section>
  );
};

export default Register;
