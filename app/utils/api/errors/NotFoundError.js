class NotFoundError extends Error {
  constructor(entityName) {
    super(`${entityName} was not found`);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;