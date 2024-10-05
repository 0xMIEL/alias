import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes';
import { BaseController } from '../../core/BaseController';
import { UserService } from './UserService';

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();

    this.userService = userService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const newUser = await this.userService.create(req.body);

    this.sendResponse({
      data: newUser,
      res,
      statusCode: HTTP_STATUS_CODES.CREATED_201,
    });
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const user = await this.userService.getOne(email, password);

    res.cookie('jwtToken', user.token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

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
      req.body,
      req.params.password,
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
