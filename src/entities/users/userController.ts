import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes';
import { UserService } from './userService';
import { hashPassword, comparePasswords } from './helpers/authHelpers';
import { generateToken } from './helpers/jwtHelpers';
import { BaseController } from '../../core/BaseController';

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();

    this.userService = userService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;

    const hashedPassword = await hashPassword(password);

    const newUser = await this.userService.create({
      ...req.body,
      password: hashedPassword,
    });

    this.sendResponse({
      data: newUser,
      res,
      statusCode: HTTP_STATUS_CODES.CREATED_201,
    });
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    const user = await this.userService.getOne(req.body.email);

    if (user && (await comparePasswords(password, user.password))) {
      const token = generateToken(user.username);
      res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
        status: 'success',
        token,
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
}
