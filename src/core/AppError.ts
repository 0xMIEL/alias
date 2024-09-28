import { HTTP_STATUS_CODES, StatusCode } from '../constants/httpStatusCodes';

export class AppError extends Error {
  statusCode: StatusCode;
  status: string;
  isOperational: boolean;

  constructor(message: string, code: StatusCode = HTTP_STATUS_CODES.BAD_REQUEST_400) {
    super(message);

    this.statusCode = code;
    this.status = 'error';
    this.isOperational = true;
  }
}
