import { NextFunction, Request, Response } from 'express';
import { GameRoomService } from './GameRoomService';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../../constants/constants';
import { BaseController } from '../../core/BaseController';

export class GameRoomController extends BaseController {
  constructor(private gameRoomService: GameRoomService) {
    super();

    this.gameRoomService = gameRoomService;
  }

  private updateGameListEvent(
    gameRoom: object | null,
    req: Request,
    action: 'update' | 'delete' | 'create',
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
    const gameRooms = await this.gameRoomService.getMany();

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

    this.updateGameListEvent(updatedRoom, req, 'update');

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const deletedRoom = await this.gameRoomService.remove(req.params.id);

    this.updateGameListEvent(deletedRoom, req, 'delete');

    this.sendResponse({
      data: deletedRoom,
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

    this.updateGameListEvent(updatedRoom, req, 'update');

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async joinTeam(req: Request, res: Response, next: NextFunction) {
    const { roomId } = req.params;
    const player = req.body;

    const updatedRoom = await this.gameRoomService.joinTeam(roomId, player);

    this.updateGameListEvent(updatedRoom, req, 'update');

    this.sendResponse({
      data: updatedRoom,
      res,
    });
  }

  async removePlayer(req: Request, res: Response, next: NextFunction) {
    const { roomId, playerId } = req.params;

    const updatedRoom = await this.gameRoomService.removePlayer(
      roomId,
      playerId,
    );

    console.log('Player id', playerId);
    console.log('Room id', roomId);

    console.log(updatedRoom);

    if (!updatedRoom) {
      this.updateGameListEvent(updatedRoom, req, 'delete');
      this.emitSocketEvent({ event: SOCKET_EVENT.KILL_ROOM, req, roomId });

      this.sendResponse({
        data: updatedRoom,
        res,
        statusCode: HTTP_STATUS_CODE.NO_CONTENT_204,
      });
    }

    this.updateGameListEvent(updatedRoom, req, 'update');

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

    const updatedRoom = await this.gameRoomService.removePlayer(
      roomId,
      playerId,
    );

    if (!updatedRoom) {
      this.updateGameListEvent(updatedRoom, req, 'delete');
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
