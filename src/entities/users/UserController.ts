import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes';
import { UserService } from './UserService';
import { BaseController } from '../../core/BaseController';
import { io } from '../../app';

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

    if (user) {
      res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
        status: 'success',
        token: user.token,
      });
    } else {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED_401)
        .json({ message: 'Invalid credentials', status: 'fail' });
    }
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

    io.emit('userCredantialsUpdate', { action: 'update', user: updatedUser });

    this.sendResponse({
      data: updatedUser,
      res
    });
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    const deletedUser = await this.userService.remove(req.params.email);

    io.emit('userListUpdate', { action: 'remove', user: deletedUser });

    this.sendResponse({
      data: deletedUser,
      res,
      statusCode: HTTP_STATUS_CODES.NO_CONTENT_204,
    });
  }
}
