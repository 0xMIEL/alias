import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes';
import { UserService } from './UserService';
import { BaseController } from '../../core/BaseController';

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();

    this.userService = userService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const user = await this.userService.create(req.body);

    this.sendResponse({
      data: {
        _id: user._id,
        email: user.email,
        roundsTotal: user.roundsTotal,
        scores: user.scores,
        username: user.username,
      },
      res,
      statusCode: HTTP_STATUS_CODES.CREATED_201,
    });
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const result = await this.userService.getOne(email, password);
    const { token, user } = result;

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

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

  async remove(req: Request, res: Response, next: NextFunction) {
    const deletedUser = await this.userService.remove(req.params.email);

    this.sendResponse({
      data: deletedUser,
      res,
      statusCode: HTTP_STATUS_CODES.NO_CONTENT_204,
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
      statusCode: HTTP_STATUS_CODES.SUCCESS_200,
    });
  }
}
