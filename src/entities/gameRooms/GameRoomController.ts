import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../../constants/constants';
import { AppError } from '../../core/AppError';
import { BaseController } from '../../core/BaseController';
import { isGameRoomFull } from '../../utils/isGameRoomFull';
import { GameRoomService } from './GameRoomService';
import getManyGameRoomsSchema from './gameRoomValidaton';

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
    const user = req.user!;
    req.body.hostUserId = user._id;

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
    const { error, value } = getManyGameRoomsSchema.validate(req.query, {
      stripUnknown: true,
    });

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
    const { roomId } = req.params;
    const user = req.user!;
    const { username } = user;

    const updatedRoom = await this.gameRoomService.joinRoom(roomId, user._id);

    this.emitSocketEvent({
      data: {
        message: `Player join ${username} the room`,
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
    const { username } = user;

    const updatedRoom = await this.gameRoomService.joinTeam({
      roomId,
      team,
      userId: user._id,
    });

    this.updateGameListEvent(updatedRoom, req, 'update');
    this.emitSocketEvent({
      data: {
        message: `New player ${username} joined team: ${team}`,
        updatedRoom,
        username,
      },
      event: SOCKET_EVENT.JOIN_TEAM,
      req,
      roomId,
    });

    if (isGameRoomFull(updatedRoom)) {
      this.emitSocketEvent({
        event: SOCKET_EVENT.FULL_LOBBY,
        req,
        roomId,
      });
    }

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async leaveRoom(req: Request, res: Response, next: NextFunction) {
    const { roomId } = req.params;
    const user = req.user!;

    const updatedRoom = await this.gameRoomService.leaveRoom(roomId, user._id);

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
        message: `Player ${user.username} leave the room`,
        updatedRoom,
      },
      event: SOCKET_EVENT.LEAVE_ROOM,
      req,
      roomId,
    });

    this.emitSocketEvent({
      event: SOCKET_EVENT.NOT_FULL_LOBBY,
      req,
      roomId,
    });

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async leaveRoomOnWindowUnload(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    return this.leaveRoom(req, res, next);
  }
}
