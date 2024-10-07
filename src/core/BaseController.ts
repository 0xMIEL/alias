import { Response, Request } from 'express';
import {
  HTTP_STATUS_CODE,
  SocketEvent,
  StatusCode,
} from '../constants/constants';

type SendResponseProps = {
  res: Response;
  data: unknown;
  statusCode?: StatusCode;
};

export type EmitSocketEvent = {
  req: Request;
  roomId?: string;
  event: SocketEvent;
  data: object;
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

  protected emitSocketEvent = ({
    req,
    roomId,
    event,
    data,
  }: EmitSocketEvent) => {
    const io = req.app.get('io');

    if (roomId) {
      io.in(roomId).emit(event, data);
    } else {
      io.emit(event, data);
    }
  };
}
