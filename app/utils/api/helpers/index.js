import { BadRequestError } from "../errors";

const parseTypeId = (typeId) => {
    const [type, mediaId] = typeId.split('_');

    if (!type || !mediaId) {
        throw new BadRequestError();
    }

    return { mediaId, type };
};

export {
    parseTypeId,
}