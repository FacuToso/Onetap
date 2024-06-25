class MethodNotAllowedError extends Error {
  constructor(message) {
    super(message || 'Method Not Allowed');
    this.name = 'MethodNotAllowedError';
  }
}

export default MethodNotAllowedError;