import apiHandler from 'utils/api/apiHandler';
import { UserCommentRepository } from 'utils/api/db';
import { BadRequestError, ForbiddenError } from 'utils/api/errors';

const deleteMediaComment = async (req, res) => {
  const { commentId } = req.query;
  const { userId } = req.auth;

  const intCommentId = Number.parseInt(commentId);
  if (!commentId || Number.isNaN(intCommentId)) {
    throw new BadRequestError('Invalid Comment Id');
  }

  const comment = await UserCommentRepository.getOne(intCommentId);

  if (comment.UserId !== userId) {
    throw new ForbiddenError('You didn\'t create this comment');
  }

  await UserCommentRepository.deleteOne(intCommentId);

  res.status(204).send();
};

export default apiHandler({ delete: deleteMediaComment });