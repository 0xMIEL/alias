import { NextFunction, Request, Response } from 'express';
import { GameRoomService } from './GameRoomService';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../../constants/constants';
import { BaseController } from '../../core/BaseController';
import { Server } from 'socket.io';

export class GameRoomController extends BaseController {
  constructor(
    private gameRoomService: GameRoomService,
    private io: Server,
  ) {
    super();

    this.gameRoomService = gameRoomService;
    this.io = io;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const newGameRoom = await this.gameRoomService.create(req.body);

    this.io.emit(SOCKET_EVENT.GAME_LIST_UPDATE, {
      action: 'create',
      game: newGameRoom,
    });

    this.sendResponse({
      data: newGameRoom,
      res,
      statusCode: HTTP_STATUS_CODE.CREATED_201,
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

    this.io.emit(SOCKET_EVENT.GAME_LIST_UPDATE, {
      action: 'update',
      game: updatedGameRoom,
    });

    this.sendResponse({
      data: updatedGameRoom,
      res,
    });
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const deletedRoom = await this.gameRoomService.remove(req.params.id);

    this.io.emit(SOCKET_EVENT.GAME_LIST_UPDATE, {
      action: 'remove',
      game: deletedRoom,
    });

    this.sendResponse({
      data: deletedRoom,
      res,
      statusCode: HTTP_STATUS_CODE.NO_CONTENT_204,
    });
  }

  async removeAll(req: Request, res: Response, next: NextFunction) {
    await this.gameRoomService.removeAll();

    this.io.emit(SOCKET_EVENT.GAME_LIST_UPDATE, { action: 'removeAll' });

    this.sendResponse({
      data: {},
      res,
      statusCode: HTTP_STATUS_CODE.NO_CONTENT_204,
    });
  }

  async joinRoom(req: Request, res: Response, next: NextFunction) {
    const { roomId, player } = req.params;

    const updatedRoom = await this.gameRoomService.joinRoom(roomId, player);

    this.io.to(roomId).emit(SOCKET_EVENT.JOIN_ROOM, {
      message: `Player join ${player} the room`,
      updatedRoom,
    });

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async joinTeam(req: Request, res: Response, next: NextFunction) {
    const { roomId } = req.params;
    const player = req.body;

    const updatedRoom = await this.gameRoomService.joinTeam(roomId, player);

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async removePlayer(req: Request, res: Response, next: NextFunction) {
    const { roomId, player } = req.params;

    const updatedRoom = await this.gameRoomService.removePlayer(roomId, player);

    this.io.to(roomId).emit(SOCKET_EVENT.LEAVE_ROOM, {
      message: `Player ${player} leave the room`,
      updatedRoom,
    });

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }
}
