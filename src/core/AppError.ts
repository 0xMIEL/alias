import { HTTP_STATUS_CODE, StatusCode } from '../constants/constants';

export class AppError extends Error {
  statusCode: StatusCode;
  status: string;
  isOperational: boolean;

  constructor(
    message: string,
    code: StatusCode = HTTP_STATUS_CODE.BAD_REQUEST_400,
  ) {
    super(message);

    this.statusCode = code;
    this.status = 'error';
    this.isOperational = true;
  }
}
