import apiHandler from 'utils/api/apiHandler';
import { UserRepository } from 'utils/api/db';
import * as AWSService from 'utils/api/aws/AWSService';

const getUsers = async (req, res) => {
  const { ignoreIds } = req.body;
  const intIgnoreIds = ignoreIds?.length ? ignoreIds.map((id) => Number.parseInt(id)) : [];

  const users = await UserRepository.getAll({
    where: {
      UserId: {
        not: {
          in: intIgnoreIds,
        },
      },
    }
  });

  const userDtos = users.map((dbUser) => ({
    userId: dbUser.UserId,
    userName: dbUser.Login,
    profileImageUrl: AWSService.generateFileUrl(dbUser.ProfileImageAWSKey),
  }));

  res.status(200).json({ items: userDtos });
};

export default apiHandler({ post: getUsers }); // TODO: this should be a get request, but we need to receive an array of IDs