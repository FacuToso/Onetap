import { useCallback, useState } from 'react';
import { LoadingSpinner } from 'components';
import classes from 'styles/authform.module.css';
import { Button, Card, Form } from 'react-bootstrap';
import Link from 'next/link';
import { motion } from 'framer-motion';

const AuthForm = ({ registerMode, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleUserChange = useCallback((e) => {
    const newUser = e.target.value;

    setUser(newUser)
  }, []);

  const handlePasswordChange = useCallback((e) => {
    const newPassword = e.target.value;

    setPassword(newPassword)
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    onSubmit({ user, password })
      .catch(() => setLoading(false)); // we'll only finish loading if we have an error to avoid form flashes
  };

  return (
    <Card className={classes.card}>
      <Card.Body>
        {loading
          ? <LoadingSpinner containerClassName={classes.spinner_container} />
          : (
            <>
              <h3 className="text-center">
                {registerMode ? 'Register' : 'Login'}
              </h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mt-3">
                  <Form.Label className={classes.input_label}>👦 User</Form.Label>
                  <Form.Control
                    value={user}
                    onChange={handleUserChange}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label className={classes.input_label}>🔐 Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </Form.Group>
                <div className={classes.footer}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                  >
                    <Button className={classes.submit_button} type="submit">
                      {registerMode ? 'Register' : 'Login'}
                    </Button>
                  </motion.div>
                  <span className="mt-3 text-center">
                    {registerMode
                      ? (
                        <>
                          You already have an account?
                          <br />
                          <Link href="login">
                            <u>Log in!</u>
                          </Link>
                        </>
                      )
                      : (
                        <>
                          You don&apos;t have an account?
                          <br />
                          <Link href="register">
                            <u>Create one!</u>
                          </Link>
                        </>
                      )}
                  </span>
                </div>
              </Form>
            </>
          )}
      </Card.Body>
    </Card>
  );
};

export default AuthForm;
