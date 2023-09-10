import CustomError from './customError';

export default class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(path: String) {
    super(`Route not found: ${path}`);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  // eslint-disable-next-line class-methods-use-this
  serializeErrors() {
    return [{ message: 'Not Found' }];
  }
}
