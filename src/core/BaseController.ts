import { Response } from 'express';
import { HTTP_STATUS_CODE, StatusCode } from '../constants/constants';

type SendResponseProps = {
  res: Response;
  data: unknown;
  statusCode?: StatusCode;
};

export class BaseController {
  protected sendResponse({
    res,
    data,
    statusCode = HTTP_STATUS_CODE.SUCCESS_200,
  }: SendResponseProps) {
    res.status(statusCode).json({
      data,
      status: 'success',
    });
  }
}
