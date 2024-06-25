class ForbiddenError extends Error {
  constructor(message) {
    super(message || 'You are not allowed to access this resource');
    this.name = 'ForbiddenError';
  }
}

export default ForbiddenError;