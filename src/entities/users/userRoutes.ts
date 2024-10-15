import { Router } from 'express';
import { UserController } from './UserController';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { UserService } from './UserService';
import { User } from './User';
import { validateId } from '../../middleware/validateId';

export const userRouter = Router();

const userService = new UserService(User);
const userController = new UserController(userService);

/**
 * @swagger
 * /api/v1/users/:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: User's unique ID
 *                   username:
 *                     type: string
 *                     description: Username of the user
 *                   email:
 *                     type: string
 *                     description: User's email address
 *                   wins:
 *                     type: number
 *                     description: Total number of wins by the user
 *                   role:
 *                     type: string
 *                     enum: [user, admin]
 *                     description: Role of the user
 *                   gameHistory:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         gameId:
 *                           type: string
 *                           description: ID of the game played
 *                         outcome:
 *                           type: string
 *                           description: Outcome of the game (e.g., win or loss)
 *       404:
 *         description: No users found
 */

userRouter
  .route('/')
  .get(asyncErrorCatch(userController.getMany.bind(userController)));

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 */  
userRouter
  .route('/register')
  .post(asyncErrorCatch(userController.create.bind(userController)));

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User's unique ID
 *                 email:
 *                   type: string
 *                   description: User's email address
 *                 username:
 *                   type: string
 *                   description: Username of the user
 *                 token:
 *                   type: string
 *                   description: Authentication token (JWT) for the user
 *       401:
 *         description: Unauthorized, invalid email or password
 */
userRouter
  .route('/login')
  .post(asyncErrorCatch(userController.getOne.bind(userController)));

/**
 * @swagger
 * /api/v1/users/logout:
 *   delete:
 *     summary: Logout a user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: Message indicating successful logout
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
userRouter
  .route('/logout')
  .delete(asyncErrorCatch(userController.logout.bind(userController)));

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Remove a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User removed successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request or invalid user ID
 *       404:
 *         description: User not found
 */
userRouter
  .route('/:id')
  .all(validateId)
  .get(asyncErrorCatch(userController.getOneById.bind(userController)))
  .delete(asyncErrorCatch(userController.remove.bind(userController)))
  .patch(asyncErrorCatch(userController.updateById.bind(userController)));
  
