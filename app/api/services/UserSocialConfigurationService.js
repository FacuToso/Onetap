import * as API from 'api/API';
import axios from "axios";

/**
 * Gets an pre-signed URL from our API, and then uploads it using that URL (AWS S3)
 * @param {*} imageFile 
 * @returns AWS Object Key
 */
const uploadImageToAws = async (imageFile) => {
  const rq = {
    fileType: imageFile.type,
  };

  return API.get('social/user/configuration/image_upload_url', rq)
    .then((response) => {
      const { url, key } = response.data;
      const options = {
        headers: {
          "Content-Type": imageFile.type
        }
      };

      return axios.put(url, imageFile, options)
        .then(() => key);
    });
};

/**
 * Edits User's Profile configuration
 * @param {*} profileDescription 
 * @param {*} selectedProfileSectionKeys 
 * @param {*} profileColorCode1 
 * @param {*} profileColorCode2 
 * @param {*} profileHeaderImageUrl 
 * @param {*} imageAwsKey 
 */
const editProfile = async (profileDescription, selectedProfileSectionKeys, profileColorCode1, profileColorCode2, profileHeaderImageUrl, imageAwsKey = null) => {
  const rq = {
    profileDescription: profileDescription,
    selectedProfileSectionKeys,
    profileColorCode1,
    profileColorCode2,
    profileHeaderImageUrl,
    ...(imageAwsKey && { profileImageAwsKey: imageAwsKey }),
  };

  return API.put('/social/user/configuration', rq);
};

export {
  uploadImageToAws,
  editProfile,
};
