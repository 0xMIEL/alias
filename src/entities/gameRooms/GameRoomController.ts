import { NextFunction, Request, Response } from 'express';
import { GameRoomService } from './GameRoomService';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes';
import { BaseController } from '../../core/BaseController';
import { io } from '../../app';

export class GameRoomController extends BaseController {
  constructor(private gameRoomService: GameRoomService) {
    super();

    this.gameRoomService = gameRoomService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const newGameRoom = await this.gameRoomService.create(req.body);

    io.emit('gameListUpdate', { action: 'create', game: newGameRoom });

    this.sendResponse({
      data: newGameRoom,
      res,
      statusCode: HTTP_STATUS_CODES.CREATED_201,
    });
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const gameRoom = await this.gameRoomService.getOne(req.params.id);

    this.sendResponse({
      data: gameRoom,
      res,
    });
  }

  async getMany(req: Request, res: Response, next: NextFunction) {
    const gameRooms = await this.gameRoomService.getMany();

    this.sendResponse({
      data: gameRooms,
      res,
    });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const updatedGameRoom = await this.gameRoomService.update(
      req.body,
      req.params.id,
    );

    io.emit('gameListUpdate', { action: 'update', game: updatedGameRoom });

    this.sendResponse({
      data: updatedGameRoom,
      res,
    });
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const deletedRoom = await this.gameRoomService.remove(req.params.id);

    io.emit('gameListUpdate', { action: 'remove', game: deletedRoom });

    this.sendResponse({
      data: deletedRoom,
      res,
      statusCode: HTTP_STATUS_CODES.NO_CONTENT_204,
    });
  }
}
