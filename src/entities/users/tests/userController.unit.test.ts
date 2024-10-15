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
    username: 'testUser',
  };

  beforeEach(() => {
    mockReq = {
      body: mockUserData,
      cookies: {},
      params: {
        id: mockUserId,
      },
    };

    mockRes = {
      clearCookie: jest.fn(),
      cookie: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    mockUserService = {
      create: jest.fn(),
      extractUsernameFromToken: jest.fn(),
      getOne: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
    } as unknown as UserService;

    userController = new UserController(mockUserService);

    jest.clearAllMocks();
  });
  describe('register', () => {
    it('should register a user and return status 200', async () => {
      const mockServiceReturnValue = {
        _id: '6704a8907b4e3858d673d4c8',
        email: mockUserData.email,
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
          token: mockServiceReturnValue.token,
          username: mockServiceReturnValue.user.username,
        },
        status: 'success',
      });
    });
  });

  describe('update', () => {
    it('should update a user and return status 200', async () => {
      const mockServiceReturnValue = {
        _id: mockUserId,
        email: mockUserData.email,
      };
      mockUserService.update = jest
        .fn()
        .mockResolvedValue(mockServiceReturnValue);

      await userController.update(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockUserService.update).toHaveBeenCalledWith(
        { email: mockUserData.email },
        mockUserData.password,
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

  describe('logout', () => {
    it('should log out a user and return success message', async () => {
      const mockToken = 'validToken';
      const mockUsername = 'testUser';

      mockUserService.extractUsernameFromToken = jest
        .fn()
        .mockResolvedValue(mockUsername);

      mockReq = {
        cookies: {
          jwtToken: mockToken,
        },
      };

      await userController.logout(
        mockReq as Request,
        mockRes as Response,
        mockNext,
      );

      expect(mockUserService.extractUsernameFromToken).toHaveBeenCalledWith(
        mockToken,
        mockRes,
      );
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.SUCCESS_200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: `User ${mockUsername} logged out successfully`,
        status: 'success',
      });
    });
  });
});
