import * as API from 'api/API';

const login = async ({ user, password }) => {
  const rq = {
    userName: user.trim(),
    password: password,
  };

  return API.post('auth/login', rq)
    .then((response) => ({
      token: response.data.token,
      userId: response.data.userId,
      userName: response.data.userName,
      profileImageUrl: response.data.profileImageUrl,
    }));
};

const register = async ({ user, password }) => {
  const rq = {
    userName: user,
    password: password,
  };

  return API.post('auth/register', rq);
};

export {
  login,
  register,
};
