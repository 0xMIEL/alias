import { Response } from 'express';
import { HTTP_STATUS_CODES, StatusCode } from '../constants/httpStatusCodes';

type SendResponseProps = {
  res: Response;
  data: unknown;
  statusCode?: StatusCode;
};

export class BaseController {
  protected sendResponse({
    res,
    data,
    statusCode = HTTP_STATUS_CODES.SUCCESS_200,
  }: SendResponseProps) {
    res.status(statusCode).json({
      data,
      status: 'success',
    });
  }
}