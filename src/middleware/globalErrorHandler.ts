/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from 'node:http';
import { HTTP_STATUS_CODE, StatusCode } from '../constants/constants';
import { AppError } from '../core/AppError';

const sendDevError = (err: AppError, res: Response, statusCode: StatusCode) => {
  const { status, message, stack } = err;
  res.status(statusCode).json({ err, message, stack, status });
};

const sendProductionError = (
  err: AppError,
  res: Response,
  statusCode: StatusCode,
) => {
  const { message, isOperational } = err;
  const clientMessage = isOperational
    ? message
    : 'Something went wrong, please try again later.';

  res.render('error-page', {
    clientMessage,
    statusCode,
    statusMessage: STATUS_CODES[statusCode],
  });
};

export const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err.name === 'ValidationError') {
    err = new AppError(err.message);
  }

  const statusCode =
    err.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_500;

  if (process.env.NODE_ENV === 'production') {
    sendProductionError(err, res, statusCode);
  } else {
    sendDevError(err, res, statusCode);
    console.log(err);
  }
};
