import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// https://www.adamrichardson.dev/blog/next-js-image-upload-s3
// TODO: improve. Params sent to AWS.config.update method are deprecated, and we are not securely using AWS S3
AWS.config.update({
  region: process.env.AWS_REGION_OT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_OT,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_OT
});

const generateFileUrl = (key) => key ? `https://${process.env.AWS_BUCKET_NAME_OT}.s3.amazonaws.com/${key}` : null;

const generateUploadFileUrl = async (fileType) => {
  const s3 = new AWS.S3();

  const key = `${uuidv4()}.${fileType.split('/')[1]}`;
  const fileParams = {
    Bucket: process.env.AWS_BUCKET_NAME_OT,
    Key: key,
    ContentType: fileType,
    Expires: 600,
    ACL: 'public-read',
  };

  const url = await s3.getSignedUrlPromise('putObject', fileParams);

  return {
    url,
    key,
  };
};

const deleteFile = async (key) => {
  if (!key) return null;
  
  const s3 = new AWS.S3();

  const fileParams = {
    Bucket: process.env.AWS_BUCKET_NAME_OT,
    Key: key,
  };

  await s3.deleteObject(fileParams).promise();
};

export {
  generateUploadFileUrl,
  generateFileUrl,
  deleteFile,
};
