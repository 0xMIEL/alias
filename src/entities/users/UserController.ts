import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE } from '../../constants/constants';
import { UserService } from './UserService';
import { BaseController } from '../../core/BaseController';
import { generateToken } from './helpers/jwtHelpers';
import { IUser } from './types/userTypes';

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();

    this.userService = userService;
  }

  private handleAuthSuccess(res: Response, user: IUser, token: string) {
    res.cookie('jwtToken', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('username', user.username, { httpOnly: true });

    this.sendResponse({
      data: {
        _id: user._id,
        email: user.email,
        roundsTotal: user.roundsTotal,
        scores: user.scores,
        token,
        username: user.username,
      },
      res,
    });
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const user = await this.userService.create(req.body);
    const token = generateToken(user.username);
    this.handleAuthSuccess(res, user, token);
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const result = await this.userService.getOne(email, password);
    const { token, user } = result;
    this.handleAuthSuccess(res, user, token);
  }

  async getOneById(req: Request, res: Response, next: NextFunction) {
    const user = await this.userService.getOneById(req.params.id);

    this.sendResponse({
      data: user,
      res,
    });
  }

  async getMany(req: Request, res: Response, next: NextFunction) {
    const users = await this.userService.getMany();

    this.sendResponse({
      data: users,
      res,
    });
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const updatedUser = await this.userService.update(
      { email: req.body.email },
      req.body.password,
    );

    this.sendResponse({
      data: updatedUser,
      res,
    });
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    const updatedUser = await this.userService.updateById(
      req.params.id,
      req.body,
      req.body.password,
    );

    this.sendResponse({
      data: updatedUser,
      res,
    });
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const deletedUser = await this.userService.remove(req.params.id);

    this.sendResponse({
      data: deletedUser,
      res,
      statusCode: HTTP_STATUS_CODE.NO_CONTENT_204,
    });
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwtToken;
    const username = await this.userService.extractUsernameFromToken(
      token,
      res,
    );

    this.sendResponse({
      data: `User ${username} logged out successfully`,
      res,
      statusCode: HTTP_STATUS_CODE.SUCCESS_200,
    });
  }
}
