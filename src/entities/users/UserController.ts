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
}
