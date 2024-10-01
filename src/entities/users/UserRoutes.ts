import { Router } from "express";
import { UserController } from "./UserController";
import { asyncErrorCatch } from "../../utils/asyncErrorCatch";
import { UserService } from "./UserService";
import { User } from "./User";

export const userRouter = Router();

const userService = new UserService(User);
const userController = new UserController(userService);

userRouter
  .route("/")
  .get(asyncErrorCatch(userController.getAll.bind(userController)));

userRouter
  .route("/register")
  .post(asyncErrorCatch(userController.register.bind(userController)));

userRouter
  .route("/login")
  .post(asyncErrorCatch(userController.login.bind(userController)));
