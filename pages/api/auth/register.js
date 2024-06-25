import apiHandler from 'utils/api/apiHandler';
import { BadRequestError } from 'utils/api/errors';
import { UserRepository } from 'utils/api/db';
import * as TMDBService from 'utils/api/tmdb/TMDBService';

const register = async (req, res) => {
  const { userName, password } = req.body;

  // Validations
  if (!userName) {
    throw new BadRequestError('Invalid Username');
  }

  if (!password) {
    throw new BadRequestError('Invalid Password');
  }

  const userWithUserName = await UserRepository.getOne(userName);
  if (userWithUserName !== null) {
    throw new BadRequestError('That Username is already in use');
  }

  const { guestSessionId } = await TMDBService.createGuestSessionId();

  const newUser = {
    Login: userName,
    Password: password,
    TMDBGuestSessionId: guestSessionId,
  };
  await UserRepository.createOne(newUser);

  res.status(201).send();
};

export default apiHandler({ post: register }, true);