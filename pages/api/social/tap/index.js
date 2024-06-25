import apiHandler from 'utils/api/apiHandler';
import { TapRepository, UserRepository } from 'utils/api/db';
import { BadRequestError } from 'utils/api/errors';

const createTap = async (req, res) => {
  const { content, respondingToTapId } = req.body;
  const { userId } = req.auth;

  if (!content || content.length === 0 || content.length > 240) {
    throw new BadRequestError('Invalid Content');
  }

  const intRespondingToTapId = Number.parseInt(respondingToTapId);
  if (respondingToTapId && intRespondingToTapId === NaN) {
    throw new BadRequestError('Invalid Responding to Tap Id');
  }

  const tap = {
    Content: content,
    RespondingToTapId: respondingToTapId,
    UserId: userId,
  }

  const dbTap = await TapRepository.createOne(tap);

  res.status(201).json({ id: dbTap.TapId});
};

export default apiHandler({ post: createTap });