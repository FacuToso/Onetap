class BadRequestError extends Error {
  constructor(message) {
    super(message || 'Invalid Params');
    this.name = 'InvalidParamsError';
  }
}

export default BadRequestError;