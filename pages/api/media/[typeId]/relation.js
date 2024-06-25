import apiHandler from 'utils/api/apiHandler';
import { UserMediaRepository } from 'utils/api/db';
import { parseTypeId } from 'utils/api/helpers'
import { NotFoundError, BadRequestError } from 'utils/api/errors';

const createUpdateRelation = async (req, res) => {
  const { userId } = req.auth;
  const { typeId } = req.query;
  const { isFavorite, isInWatchLater } = req.body;

  const { mediaId, type } = parseTypeId(typeId);

  const intMediaId = Number.parseInt(mediaId);
  if (Number.isNaN(intMediaId)) {
    throw new BadRequestError('Invalid Media Id');
  }

  let relation = (await UserMediaRepository.getOne(userId, type, Number.parseInt(intMediaId)) || {});

  relation.IsFavorite = isFavorite;
  relation.IsInWatchLater = isInWatchLater;

  if (!relation.UserId) {
    // Create
    relation.UserId = userId;
    relation.MediaType = type;
    relation.MediaId = intMediaId;

    await UserMediaRepository.createOne(relation);
  } else if (!relation.IsFavorite && !relation.IsInWatchLater) {
    await UserMediaRepository.deleteOne(userId, type, intMediaId); // if all relations are false, then we don't need to have this record on the table. Deleting it
  } else {
    await UserMediaRepository.updateOne(userId, type, intMediaId, relation);
  }

  res.status(204).send();
};

const deleteRelation = async (req, res) => {
  const { userId } = req.auth;
  const { typeId } = req.query;

  const { mediaId, type } = parseTypeId(typeId);

  const intMediaId = Number.parseInt(mediaId);
  if (Number.isNaN(intMediaId)) {
    throw new BadRequestError('Invalid Media Id');
  }

  const relation = await UserMediaRepository.getOne(userId, type, intMediaId);

  if (!relation) {
    throw new NotFoundError('User Media relation');
  }

  await UserMediaRepository.deleteOne(userId, type, intMediaId);

  res.status(204).send();
};

export default apiHandler({ post: createUpdateRelation, delete: deleteRelation });