import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../../constants/httpStatusCodes";
import { UserService } from "./UserService";
import { hashPassword, comparePasswords } from "./helpers/authHelpers";
import { generateToken } from "./helpers/jwtHelpers";
import { AppError } from "../../core/AppError";

export class UserController {
  constructor(private userService: UserService) {
    this.userService = userService;
  }


  async register(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    const existingUser = await this.userService.findUser(email);
    if (existingUser) {
      throw new AppError(
        "Email already registered",
        HTTP_STATUS_CODES.BAD_REQUEST_400
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.userService.createUser({
      ...req.body,
      password: hashedPassword,
    });

    res.status(HTTP_STATUS_CODES.CREATED_201).json({
      data: newUser,
      status: "success",
    });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { password } = req.body;
    const user = await this.userService.findUser(req.body.email);

    if (user && (await comparePasswords(password, user.password))) {
      const token = generateToken(user.id);
      res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
        status: "success",
        token,
      });
    } else {
      res
        .status(HTTP_STATUS_CODES.UNAUTHORIZED_401)
        .json({ status: "fail", message: "Invalid credentials" });
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const users = await this.userService.getManyUsers();

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: users,
      status: "success",
    });
  }
}
