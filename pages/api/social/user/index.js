import apiHandler from 'utils/api/apiHandler';
import { UserRepository } from 'utils/api/db';
import * as AWSService from 'utils/api/aws/AWSService';

const searchUsers = async (req, res) => {
  const { query } = req.query;

  const users = await UserRepository.search(query);

  const usersDto = users.map((dbUser) => ({
    userId: dbUser.UserId,
    userName: dbUser.Login,
    profileImageUrl: AWSService.generateFileUrl(dbUser.ProfileImageAWSKey),
  }))

  res.status(200).json({ items: usersDto });
}

export default apiHandler({ get: searchUsers }, true);