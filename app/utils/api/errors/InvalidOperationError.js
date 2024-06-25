class InvalidOperationError extends Error {
  constructor(message) {
    super(message || 'Invalid Operation');
    this.name = 'InvalidOperationError';
  }
}

export default InvalidOperationError;