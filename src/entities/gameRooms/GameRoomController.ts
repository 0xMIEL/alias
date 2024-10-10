import { NextFunction, Request, Response } from 'express';
import { GameRoomService } from './GameRoomService';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../../constants/constants';
import { BaseController } from '../../core/BaseController';
import getManyGameRoomsSchema from './gameRoomValidaton';
import { AppError } from '../../core/AppError';

export class GameRoomController extends BaseController {
  constructor(private gameRoomService: GameRoomService) {
    super();

    this.gameRoomService = gameRoomService;
  }

  private updateGameListEvent(
    gameRoom: object,
    req: Request,
    action: 'update' | 'remove' | 'create',
  ) {
    this.emitSocketEvent({
      data: {
        action,
        game: gameRoom,
      },
      event: SOCKET_EVENT.GAME_LIST_UPDATE,
      req,
    });
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const newGameRoom = await this.gameRoomService.create(req.body);

    this.updateGameListEvent(newGameRoom, req, 'create');

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
    const { error, value } = getManyGameRoomsSchema.validate(req.query);

    if (error) {
      throw new AppError(error.message);
    }

    const gameRooms = await this.gameRoomService.getMany(value);

    this.sendResponse({
      data: gameRooms,
      res,
    });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const updatedRoom = await this.gameRoomService.update(
      req.body,
      req.params.id,
    );

    this.updateGameListEvent(updatedRoom!, req, 'update');

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    await this.gameRoomService.remove(req.params.id);

    this.updateGameListEvent({ _id: req.params.id }, req, 'remove');

    this.sendResponse({
      data: {},
      res,
      statusCode: HTTP_STATUS_CODE.NO_CONTENT_204,
    });
  }

  async removeAll(req: Request, res: Response, next: NextFunction) {
    await this.gameRoomService.removeAll();

    this.sendResponse({
      data: {},
      res,
      statusCode: HTTP_STATUS_CODE.NO_CONTENT_204,
    });
  }

  async joinRoom(req: Request, res: Response, next: NextFunction) {
    const { roomId, playerId } = req.params;

    const updatedRoom = await this.gameRoomService.joinRoom(roomId, playerId);

    this.emitSocketEvent({
      data: {
        message: `Player join ${playerId} the room`,
        updatedRoom,
      },
      event: SOCKET_EVENT.JOIN_ROOM,
      req,
      roomId,
    });

    this.updateGameListEvent(updatedRoom!, req, 'update');

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async joinTeam(req: Request, res: Response, next: NextFunction) {
    const { roomId } = req.params;
    const { team } = req.body;

    const user = req.user!;

    const updatedRoom = await this.gameRoomService.joinTeam({
      roomId,
      team,
      userId: user._id,
    });

    this.updateGameListEvent(updatedRoom, req, 'update');
    this.emitSocketEvent({
      data: {
        message: `New player ${user.username} joined team: ${team}`,
        updatedRoom,
      },
      event: SOCKET_EVENT.JOIN_TEAM,
      req,
      roomId,
    });

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async leaveRoom(req: Request, res: Response, next: NextFunction) {
    const { roomId, playerId } = req.params;

    const updatedRoom = await this.gameRoomService.leaveRoom(roomId, playerId);

    if (!updatedRoom) {
      this.emitSocketEvent({
        data: { roomId },
        event: SOCKET_EVENT.KILL_ROOM,
        req,
        roomId,
      });

      this.updateGameListEvent({ _id: roomId }, req, 'remove');

      return this.sendResponse({
        data: {},
        res,
        statusCode: HTTP_STATUS_CODE.NO_CONTENT_204,
      });
    }

    this.updateGameListEvent(updatedRoom!, req, 'update');

    this.emitSocketEvent({
      data: {
        message: `Player ${playerId} leave the room`,
        updatedRoom,
      },
      event: SOCKET_EVENT.LEAVE_ROOM,
      req,
      roomId,
    });

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async removePlayerOnWindowUnload(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { roomId, playerId } = req.params;

    const updatedRoom = await this.gameRoomService.leaveRoom(roomId, playerId);

    if (!updatedRoom) {
      this.updateGameListEvent({ _id: roomId }, req, 'remove');
    } else {
      this.updateGameListEvent(updatedRoom, req, 'update');
    }

    this.sendResponse({
      data: {},
      res,
      statusCode: HTTP_STATUS_CODE.NO_CONTENT_204,
    });
  }
}
