import apiHandler from 'utils/api/apiHandler';
import * as AWSService from 'utils/api/aws/AWSService';
import { InvalidOperationError } from 'utils/api/errors';

const getAwsImageUploadUrl = async (req, res) => {
  const { fileType } = req.query;

  if (fileType !== 'image/png' && fileType !== 'image/jpeg') {
    throw new InvalidOperationError('Only .png and .jpeg images are accepted');
  }

  const { url, key } = await AWSService.generateUploadFileUrl(fileType);

  res.status(200).json({
    url,
    key,
  });
}

export default apiHandler({ get: getAwsImageUploadUrl });