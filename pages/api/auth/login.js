import apiHandler from 'utils/api/apiHandler';
import { BadRequestError } from 'utils/api/errors';
import jwt from 'jsonwebtoken';
import { UserRepository } from 'utils/api/db';
import getHashedPassword from 'utils/api/auth/getHashedPassword';
import getConfig from 'next/config';
import * as AWSService from 'utils/api/aws/AWSService';

const { serverRuntimeConfig } = getConfig();

const login = async (req, res) => {
  const { userName, password } = req.body;

  // Validations
  if (!userName) {
    throw new BadRequestError('Invalid Username');
  }

  if (!password) {
    throw new BadRequestError('Invalid Password');
  }

  const user = await UserRepository.getOne(userName);
  if (!user) {
    throw new BadRequestError('Invalid Credentials');
  }
  
  const hashedPassword = getHashedPassword(password);
  if (hashedPassword !== user.Password) {
    throw new BadRequestError('Invalid Credentials');
  }

  // Generating and returning Token
  const token = jwt.sign({ userId: user.UserId, userName }, serverRuntimeConfig.secret, { expiresIn: '6h' });
  res.status(200).json({ token, userId: user.UserId, userName, profileImageUrl: AWSService.generateFileUrl(user.ProfileImageAWSKey) });
};

export default apiHandler({ post: login }, true);