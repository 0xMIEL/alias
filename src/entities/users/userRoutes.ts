import { Router } from 'express';
import { UserController } from './userController';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { UserService } from './userService';
import { User } from './User';

export const userRouter = Router();

const userService = new UserService(User);
const userController = new UserController(userService);

userRouter
  .route('/')
  .get(asyncErrorCatch(userController.getMany.bind(userController)));

userRouter
  .route('/register')
  .post(asyncErrorCatch(userController.create.bind(userController)));

userRouter
  .route('/login')
  .post(asyncErrorCatch(userController.getOne.bind(userController)));
