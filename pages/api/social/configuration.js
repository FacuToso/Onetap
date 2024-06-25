import apiHandler from 'utils/api/apiHandler';
import { SocialProfileSectionRepository, SocialProfileHeaderImageRepository } from 'utils/api/db';

const getSocialConfiguration = async (req, res) => {
    const socialProfileSections = await SocialProfileSectionRepository.getAll();
    const socialProfileHeaderImages = await SocialProfileHeaderImageRepository.getAll();

    const socialProfileSectionDtos = socialProfileSections.map((socialProfileSection) => ({
        key: socialProfileSection.Key,
        title: socialProfileSection.Title,
    }));

    const socialProfileHeaderImageDtos = socialProfileHeaderImages.map((socialProfileHeaderImage) => ({
      imageUrl: socialProfileHeaderImage.ImageUrl,
      imageName: socialProfileHeaderImage.ImageName,
    }))

    res.status(200).json({ 
      socialProfileSections: socialProfileSectionDtos,
      socialProfileHeaderImages: socialProfileHeaderImageDtos,
    });
}

export default apiHandler({ get: getSocialConfiguration });