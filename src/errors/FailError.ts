import CustomError from './customError';

export default class FailError extends CustomError {
  statusCode = 400;
  constructor(
    public error: string,
    _statusCode: number = 400,
  ) {
    super(error);
    this.statusCode = _statusCode;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.error }];
  }
}
