/* eslint-disable no-magic-numbers */

import { NextFunction, Request, Response } from 'express';
import { GameRoomController } from '../GameRoomController';
import { GameRoomService } from '../GameRoomService';
import { Server } from 'socket.io';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../../../constants/constants';

describe('GameRoomController', () => {
  let gameRoomController: GameRoomController;
  let mockGameRoomService: GameRoomService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockIo: Partial<Server>;

  const mockGameId = '6703c61ec87924a96bea60ec';
  const mockHostUserId = '6555f6f9ceae7adbfa0c49f7';
  const mockUserId = '6704a8907b4e3858d673d4c8';
  const mockUsername = 'username';

  beforeEach(() => {
    mockReq = {
      //@ts-expect-error error
      app: { get: jest.fn() } as Partial<Express.Application>,
      body: {
        hostUserId: mockHostUserId,
        player: { team: 2, userId: mockUserId },
        team: 2,
        userId: mockHostUserId,
      },
      params: {
        id: mockGameId,
        playerId: mockUserId,
        roomId: mockGameId,
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: { _id: mockUserId, username: mockUsername } as any,
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    mockIo = { emit: jest.fn(), in: jest.fn().mockReturnThis() };
    //@ts-expect-error error
    (mockReq.app.get as jest.Mock).mockReturnValue(mockIo);

    mockGameRoomService = {} as unknown as GameRoomService;
    gameRoomController = new GameRoomController(mockGameRoomService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it(`should return a response with a new gameRoom data, status 201, and emit ${SOCKET_EVENT.GAME_LIST_UPDATE} socket event`, async () => {
      const mockServiceReturnValue = { _id: mockGameId };

      mockGameRoomService.create = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await gameRoomController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.GAME_LIST_UPDATE, {
        action: 'create',
        game: mockServiceReturnValue,
      });
      expect(mockIo.in).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.CREATED_201);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockServiceReturnValue,
        status: 'success',
      });
    });
  });

  describe('get one game room by id', () => {
    it('should return response with a room data and status 200', async () => {
      const mockServiceReturnValue = { _id: mockGameId };

      mockGameRoomService.getOne = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await gameRoomController.getOne(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.getOne).toHaveBeenCalledWith(
        mockReq.params!.id,
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.SUCCESS_200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockServiceReturnValue,
        status: 'success',
      });
    });
  });

  describe('get many', () => {
    it('should return response with a list of game rooms and status code 200 without query params', async () => {
      const mockServiceReturnValue = [{ _id: mockGameId }];

      mockGameRoomService.getMany = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await gameRoomController.getMany(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.getMany).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.SUCCESS_200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockServiceReturnValue,
        status: 'success',
      });
    });
  });

  describe('update', () => {
    it(`should return response with an updated room and emit ${SOCKET_EVENT.GAME_LIST_UPDATE} event`, async () => {
      const mockServiceReturnValue = { _id: mockGameId };

      mockGameRoomService.update = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await gameRoomController.update(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.update).toHaveBeenCalledWith(
        mockReq.body,
        mockReq.params!.id,
      );
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.GAME_LIST_UPDATE, {
        action: 'update',
        game: mockServiceReturnValue,
      });
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.SUCCESS_200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockServiceReturnValue,
        status: 'success',
      });
    });
  });

  describe('remove', () => {
    it(`should return response with 204 code and emit ${SOCKET_EVENT.GAME_LIST_UPDATE} event`, async () => {
      mockGameRoomService.remove = jest.fn();

      await gameRoomController.remove(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.remove).toHaveBeenCalledWith(
        mockReq.params!.id,
      );
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.GAME_LIST_UPDATE, {
        action: 'remove',
        game: { _id: mockReq.params!.id },
      });
      expect(mockRes.status).toHaveBeenCalledWith(
        HTTP_STATUS_CODE.NO_CONTENT_204,
      );
    });
  });

  describe('join room', () => {
    it(`should return updated room in response and emit ${SOCKET_EVENT.JOIN_ROOM}, ${SOCKET_EVENT.GAME_LIST_UPDATE}`, async () => {
      const mockServiceReturnValue = { _id: mockGameId };
      mockGameRoomService.joinRoom = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await gameRoomController.joinRoom(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.joinRoom).toHaveBeenCalledWith(
        mockReq.params!.roomId,
        mockUserId,
      );
      expect(mockIo.emit).toHaveBeenCalledTimes(2);
      expect(mockIo.in).toHaveBeenCalledWith(mockGameId);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.GAME_LIST_UPDATE, {
        action: 'update',
        game: mockServiceReturnValue,
      });
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.JOIN_ROOM, {
        message: `Player join ${mockUsername} the room`,
        updatedRoom: mockServiceReturnValue,
      });
    });
  });

  describe('joinTeam', () => {
    it(`should return response with updated room and emit ${SOCKET_EVENT.GAME_LIST_UPDATE}, ${SOCKET_EVENT.JOIN_TEAM}`, async () => {
      const mockServiceReturnValue = { _id: mockGameId };

      mockGameRoomService.joinTeam = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await gameRoomController.joinTeam(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.joinTeam).toHaveBeenCalledWith({
        roomId: mockReq.params!.roomId,
        team: mockReq.body.team,
        userId: mockUserId,
      });

      expect(mockIo.emit).toHaveBeenCalledTimes(2);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.GAME_LIST_UPDATE, {
        action: 'update',
        game: mockServiceReturnValue,
      });
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.JOIN_TEAM, {
        message: `New player ${mockUsername} joined team: ${mockReq.body.team}`,
        updatedRoom: mockServiceReturnValue,
      });
      expect(mockIo.in).toHaveBeenCalledWith(mockReq.params!.roomId);
    });
  });

  describe('leaveRoom', () => {
    it(`leaving user is a host, should return response with 204 and emit ${SOCKET_EVENT.KILL_ROOM}, ${SOCKET_EVENT.GAME_LIST_UPDATE}`, async () => {
      mockGameRoomService.leaveRoom = jest.fn().mockResolvedValue(null);

      await gameRoomController.leaveRoom(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.leaveRoom).toHaveBeenCalledWith(
        mockReq.params!.roomId,
        mockUserId,
      );

      expect(mockIo.in).toHaveBeenCalledWith(mockReq.params!.roomId);
      expect(mockIo.emit).toHaveBeenCalledTimes(2);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.KILL_ROOM, {
        roomId: mockReq.params!.roomId,
      });
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.GAME_LIST_UPDATE, {
        action: 'remove',
        game: { _id: mockReq.params!.roomId },
      });
      expect(mockRes.status).toHaveBeenCalledWith(
        HTTP_STATUS_CODE.NO_CONTENT_204,
      );
    });

    it(`leaving user is not a host, should response with a 200 and updated room, emit ${SOCKET_EVENT.GAME_LIST_UPDATE}, ${SOCKET_EVENT.LEAVE_ROOM}`, async () => {
      const mockServiceReturnValue = { _id: mockGameId };
      mockGameRoomService.leaveRoom = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await gameRoomController.leaveRoom(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockGameRoomService.leaveRoom).toHaveBeenCalledWith(
        mockReq.params!.roomId,
        mockUserId,
      );
      expect(mockIo.in).toHaveBeenCalledWith(mockReq.params!.roomId);
      expect(mockIo.emit).toHaveBeenCalledTimes(2);
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.GAME_LIST_UPDATE, {
        action: 'update',
        game: mockServiceReturnValue,
      });
      expect(mockIo.emit).toHaveBeenCalledWith(SOCKET_EVENT.LEAVE_ROOM, {
        message: `Player ${mockUsername} leave the room`,
        updatedRoom: mockServiceReturnValue,
      });
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.SUCCESS_200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockServiceReturnValue,
        status: 'success',
      });
    });
  });

  describe('removePlayerOnWindowUnload', () => {
    describe('leaving user is a host', () => {
      it(`should response 204, emit ${SOCKET_EVENT.GAME_LIST_UPDATE} action remove`, async () => {
        mockGameRoomService.leaveRoom = jest.fn().mockResolvedValue(null);

        await gameRoomController.removePlayerOnWindowUnload(
          mockReq as Request,
          mockRes as Response,
          mockNext,
        );

        expect(mockGameRoomService.leaveRoom).toHaveBeenCalledWith(
          mockReq.params!.roomId,
          mockReq.params!.playerId,
        );
        expect(mockIo.emit).toHaveBeenCalledWith(
          SOCKET_EVENT.GAME_LIST_UPDATE,
          { action: 'remove', game: { _id: mockReq.params!.roomId } },
        );
        expect(mockRes.status).toHaveBeenCalledWith(
          HTTP_STATUS_CODE.NO_CONTENT_204,
        );
      });
    });

    describe('leaving user is not a host', () => {
      it(`should response 204, emit ${SOCKET_EVENT.GAME_LIST_UPDATE} action update`, async () => {
        const mockServiceReturnValue = { _id: mockGameId };
        mockGameRoomService.leaveRoom = jest
          .fn()
          .mockResolvedValue(mockServiceReturnValue);

        await gameRoomController.removePlayerOnWindowUnload(
          mockReq as Request,
          mockRes as Response,
          mockNext,
        );

        expect(mockGameRoomService.leaveRoom).toHaveBeenCalledWith(
          mockReq.params!.roomId,
          mockReq.params!.playerId,
        );
        expect(mockIo.emit).toHaveBeenCalledWith(
          SOCKET_EVENT.GAME_LIST_UPDATE,
          { action: 'update', game: mockServiceReturnValue },
        );
        expect(mockRes.status).toHaveBeenCalledWith(
          HTTP_STATUS_CODE.NO_CONTENT_204,
        );
      });
    });
  });
});
