/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
process.env.JWT_SECRET = 'testSecret';
import { NextFunction, Request, Response } from 'express';
import { UserController } from '../UserController';
import { UserService } from '../UserService';
import { HTTP_STATUS_CODE } from '../../../constants/constants';

describe('UserController', () => {
  let userController: UserController;
  let mockUserService: UserService;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  const mockUserId = '6704a8907b4e3858d673d4c8';
  const mockUserData = {
    email: 'test@example.com',
    password: 'password123',
    roundsTotal: 0,
    scores: [],
    username: 'testUser',
  };

  beforeEach(() => {
    mockReq = {
      body: mockUserData,
      params: {
        id: mockUserId,
      },
    };
    mockRes = {
      cookie: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    mockUserService = {} as unknown as UserService;
    userController = new UserController(mockUserService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and return status 200', async () => {
      const mockServiceReturnValue = {
        _id: '6704a8907b4e3858d673d4c8',
        email: mockUserData.email,
        roundsTotal: mockUserData.roundsTotal,
        scores: mockUserData.scores,
        token: 'dummyToken',
        username: mockUserData.username,
      };

      mockUserService.create = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await userController.create(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockUserService.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.SUCCESS_200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          ...mockServiceReturnValue,
          token: expect.any(String),
        },
        status: 'success',
      });
    });
  });

  describe('login', () => {
    it('should login a user and return status 200 with a token', async () => {
      const mockToken = 'token123';
      const mockServiceReturnValue = {
        token: mockToken,
        user: {
          _id: '6704a8907b4e3858d673d4c8',
          email: 'test@example.com',
          password: 'password123',
          roundsTotal: 0,
          scores: [],
          username: 'testUser',
        },
      };

      mockUserService.getOne = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await userController.getOne(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockUserService.getOne).toHaveBeenCalledWith(
        mockReq.body.email,
        mockReq.body.password,
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.SUCCESS_200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: {
          _id: mockServiceReturnValue.user._id,
          email: mockServiceReturnValue.user.email,
          roundsTotal: mockServiceReturnValue.user.roundsTotal,
          scores: mockServiceReturnValue.user.scores,
          token: mockServiceReturnValue.token,
          username: mockServiceReturnValue.user.username,
        },
        status: 'success',
      });
    });
  });

  describe('update', () => {
    it('should update a user and return status 200', async () => {
      const mockServiceReturnValue = { ...mockUserData, _id: mockUserId };
  
      // Mock the update function
      mockUserService.update = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);
  
      // Call the update method with the correct parameters
      await userController.update(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );
  
      // Adjust the expected parameters for the update method
      expect(mockUserService.update).toHaveBeenCalledWith(
        { username: mockUserData.username, email: mockUserData.email, roundsTotal: mockUserData.roundsTotal, scores: mockUserData.scores },
        mockUserData.password // Pass the password separately
      );
  
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.SUCCESS_200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockServiceReturnValue,
        status: 'success',
      });
    });
  });
  

  describe('remove', () => {
    it('should remove a user and return status 204', async () => {
      mockUserService.remove = jest.fn();

      await userController.remove(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockUserService.remove).toHaveBeenCalledWith(mockReq.params!.id);
      expect(mockRes.status).toHaveBeenCalledWith(
        HTTP_STATUS_CODE.NO_CONTENT_204,
      );
    });
  });
});
