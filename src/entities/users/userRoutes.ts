import { Router } from 'express';
import { UserController } from './UserController';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { UserService } from './UserService';
import { User } from './User';
import { validateId } from '../../middleware/validateId';

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

userRouter
  .route('/logout')
  .delete(asyncErrorCatch(userController.logout.bind(userController)));

userRouter
  .route('/:id')
  .all(validateId)
  .get(asyncErrorCatch(userController.getOne.bind(userController)))
  .delete(asyncErrorCatch(userController.remove.bind(userController)))
  .patch(asyncErrorCatch(userController.update.bind(userController)));
