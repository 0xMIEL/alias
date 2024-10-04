process.env.JWT_SECRET = 'test_secret_key';

import { Model } from 'mongoose';
import { UserService } from '../UserService';
import { IUser } from '../types/userTypes';
import { comparePasswords } from '../helpers/authHelpers';
import { generateToken, verifyToken } from '../helpers/jwtHelpers';
import { AppError } from '../../../core/AppError';
import { Response } from 'express';
import { User } from '../User';

jest.mock('../helpers/authHelpers');
jest.mock('../helpers/jwtHelpers');

describe('UserService', () => {
  let userService: UserService;
  let mockUserInstance: any;

  beforeEach(() => {
    mockUserInstance = new User({
      email: 'test@example.com',
      password: 'hashedPassword',
      roundsTotal: 0,
      scores: [{ score: 100, team: 1 }],
      username: 'testUser',
    });

    jest.spyOn(mockUserInstance, 'save').mockResolvedValue(mockUserInstance);

    jest.spyOn(User, 'create').mockResolvedValue(mockUserInstance);

    userService = new UserService(User as Model<IUser>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOne', () => {
    it('should return user and token for valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'plainPassword';
      const user = { email, password: 'hashedPassword', username: 'testUser' };
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('token');
      jest.spyOn(User, 'findOne').mockResolvedValue(user);

      const result = await userService.getOne(email, password);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(comparePasswords).toHaveBeenCalledWith(password, user.password);
      expect(generateToken).toHaveBeenCalledWith(user.username);
      expect(result).toEqual({ token: 'token', user });
    });

    it('should throw an error for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await expect(userService.getOne(email, password)).rejects.toThrow(
        AppError,
      );
    });
  });

  describe('getMany', () => {
    it('should return an array of users', async () => {
      const users = [{ email: 'test@example.com', username: 'testUser' }];
      jest.spyOn(User, 'find').mockResolvedValue(users);

      const result = await userService.getMany();

      expect(User.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('remove', () => {
    it('should throw an error if user does not exist', async () => {
      const email = 'nonexistent@example.com';
      jest.spyOn(User, 'findOne').mockResolvedValue(null);

      await expect(userService.remove(email)).rejects.toThrow(AppError);
    });

    it('should return the deleted user', async () => {
      const email = 'test@example.com';
      const user = { email, username: 'testUser' };
      jest.spyOn(User, 'findOne').mockResolvedValue(user);

      const result = await userService.remove(email);

      expect(User.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });
  });

  describe('extractUsernameFromToken', () => {
    it('should throw an error if no token is provided', async () => {
      const res = {} as Response;

      await expect(
        userService.extractUsernameFromToken('', res),
      ).rejects.toThrow(AppError);
    });

    it('should return username from token', async () => {
      const token = 'validToken';
      const res = { clearCookie: jest.fn() } as unknown as Response;
      const decoded = { userId: 'testUser' };
      (verifyToken as jest.Mock).mockReturnValue(decoded);

      const result = await userService.extractUsernameFromToken(token, res);

      expect(verifyToken).toHaveBeenCalledWith(token);
      expect(res.clearCookie).toHaveBeenCalledWith('jwtToken');
      expect(result).toEqual(decoded.userId);
    });
  });
});
