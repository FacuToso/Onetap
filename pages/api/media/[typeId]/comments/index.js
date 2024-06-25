import apiHandler from 'utils/api/apiHandler';
import { UserCommentRepository } from 'utils/api/db';
import { parseTypeId } from 'utils/api/helpers'
import { BadRequestError } from 'utils/api/errors';
import * as AWSService from 'utils/api/aws/AWSService';

const getMediaComments = async (req, res) => {
  const { typeId } = req.query;

  const { mediaId, type } = parseTypeId(typeId);

  const intMediaId = Number.parseInt(mediaId);
  if (!intMediaId) {
    throw new BadRequestError('Invalid Media Id');
  }

  const comments = await UserCommentRepository.getMediaComments(intMediaId, type);

  const commentDtos = comments.map((comment) => ({
    userCommentId: comment.UserCommentId,
    userId: comment.User.UserId,
    userName: comment.User.Login,
    profileImageUrl: AWSService.generateFileUrl(comment.User.ProfileImageAWSKey),
    comment: comment.Comment,
    createDate: comment.CreateDate,
  }))

  res.status(200).json({ items: commentDtos });
};

const createMediaComment = async (req, res) => {
    const { typeId } = req.query;
    const { userId } = req.auth;
    const { comment } = req.body;
  
    const { mediaId, type } = parseTypeId(typeId);

    const intMediaId = Number.parseInt(mediaId);
    if (!intMediaId) {
      throw new BadRequestError('Invalid Media Id');
    }

    if (!comment || !comment.length) {
        throw new BadRequestError('Invalid Comment');
    }

    const newComment = {
        UserId: userId,
        MediaId: intMediaId,
        MediaType: type,
        Comment: comment,
        CreateDate: new Date(),
    };

    await UserCommentRepository.createOne(newComment);

    res.status(201).send();
};

export default apiHandler({ get: getMediaComments, post: createMediaComment }, true); // TODO: createMediaComment must not be public. Find a way to make publicity endpoint-level instead of path level