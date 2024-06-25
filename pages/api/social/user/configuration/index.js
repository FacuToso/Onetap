import apiHandler from 'utils/api/apiHandler';
import { UserRepository } from 'utils/api/db';
import * as AWSService from 'utils/api/aws/AWSService';
import { BadRequestError } from 'utils/api/errors';

const getUserProfileConfiguration = async (req, res) => {
  const { userId } = req.auth;
  const user = await UserRepository.getOneByIdWithFullData(userId);

  const userConfigDto = {
    userId: user.UserId,
    userName: user.Login,
    profileImageUrl: AWSService.generateFileUrl(user.ProfileImageAWSKey),
    description: user.ProfileDescription,
    profileColorCode1: user.ProfileColorCode1,
    profileColorCode2: user.ProfileColorCode2,
    profileHeaderImageUrl: user.ProfileHeaderImageUrl,
    profileSectionKeys: user.UserSocialProfileSections.map((userSocialProfileSection) => userSocialProfileSection.SocialProfileSection.Key),
  }

  res.status(200).json(userConfigDto);
}

const updateUserProfileConfiguration = async (req, res) => {
  const { userId } = req.auth;
  const { profileDescription, selectedProfileSectionKeys, profileImageAwsKey, profileColorCode1, profileColorCode2, profileHeaderImageUrl } = req.body;
  const user = await UserRepository.getOneById(userId);

  if ((profileColorCode1 || profileColorCode2) && !(profileColorCode1 && profileColorCode2)) {
    throw new BadRequestError('Either both color 1 and 2 have to be specified, or none of them');
  }

  // If we are updating user's profile image, we'll delete his old one from AWS storage
  if (profileImageAwsKey) {
    await AWSService.deleteFile(user.ProfileImageAWSKey);
  }

  const updatedUser = {
    ProfileDescription: profileDescription,
    ...(profileImageAwsKey && {
      ProfileImageAWSKey: profileImageAwsKey,
    }),
    ...(profileColorCode1 && {
      ProfileColorCode1: profileColorCode1,
      ProfileColorCode2: profileColorCode2,
    }),
    ProfileHeaderImageUrl: profileHeaderImageUrl,
  };
  const userSocialProfileSections = selectedProfileSectionKeys.map((key) => ({
    SocialProfileSectionKey: key,
  }));

  await UserRepository.updateConfig(userId, updatedUser, userSocialProfileSections);
  
  const updatedUserDto = {
    userId: user.UserId,
    userName: user.Login,
    profileImageUrl: AWSService.generateFileUrl(profileImageAwsKey),
  };

  res.status(200).json(updatedUserDto);
};

export default apiHandler({ get: getUserProfileConfiguration, put: updateUserProfileConfiguration });