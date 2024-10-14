import { Router } from 'express';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { GameRoomService } from './GameRoomService';
import { GameRoom } from './GameRoom';
import { GameRoomController } from './GameRoomController';
import { validateId } from '../../middleware/validateId';
import { throwAuthErrorIfNotAuthenticated } from '../../middleware/throwAuthErrorIfNotAuthenticated';

export const gameRoomRouter = Router();

gameRoomRouter.use('/:id', validateId);

const gameRoomService = new GameRoomService(GameRoom);
const gameRoomeController = new GameRoomController(gameRoomService);

/**
 * @swagger
 * /api/v1/gamerooms:
 *   post:
 *     summary: Create a new game room
 *     tags: [GameRoom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - maxPlayers
 *               - timePerRound
 *               - teamSize
 *               - roundsTotal
 *               - hostUserId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Game Room 1"
 *                 description: The name of the game room.
 *               maxPlayers:
 *                 type: integer
 *                 example: 4
 *                 description: The maximum number of players allowed in the game room.
 *               timePerRound:
 *                 type: integer
 *                 example: 2
 *                 description: The time allocated for each round in seconds.
 *               teamSize:
 *                 type: integer
 *                 example: 2
 *                 description: The number of players per team.
 *               roundsTotal:
 *                 type: integer
 *                 example: 5
 *                 description: The total number of rounds to be played.
 *               hostUserId:
 *                 type: string
 *                 example: "user123"
 *                 description: The ID of the user hosting the game room.
 *     responses:
 *       201:
 *         description: Successfully created a new game room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentRound:
 *                       type: integer
 *                       example: 0
 *                     hostUserId:
 *                       type: string
 *                       example: "user123"
 *                     playerJoined:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: []
 *                     roundsTotal:
 *                       type: integer
 *                       example: 5
 *                     status:
 *                       type: string
 *                       example: "lobby"
 *                     teamSize:
 *                       type: integer
 *                       example: 2
 *                     timePerRound:
 *                       type: integer
 *                       example: 2
 *                     _id:
 *                       type: string
 *                       example: "6706ad06a7c209ed19bf91b5"
 *                     players:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           team:
 *                             type: integer
 *                             example: 1
 *                           _id:
 *                             type: string
 *                             example: "6706ad06a7c209ed19bf91b6"
 *                     scores:
 *                       type: array
 *                       items:
 *                         type: object
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-09T16:19:18.558Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-10-09T16:19:18.558Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                 status:
 *                   type: string
 *                   example: "success"
 *       400:
 *         description: Bad request, invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Validation error: 'name' is required"
 *   get:
 *     summary: Get all game rooms
 *     tags: [GameRoom]
 *     responses:
 *       200:
 *         description: A list of game rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       currentRound:
 *                         type: integer
 *                       hostUserId:
 *                         type: string
 *                       playerJoined:
 *                         type: array
 *                         items:
 *                           type: string
 *                       roundsTotal:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       teamSize:
 *                         type: integer
 *                       timePerRound:
 *                         type: integer
 *                       players:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             team:
 *                               type: integer
 *                             _id:
 *                               type: string
 *                       scores:
 *                         type: array
 *                         items:
 *                           type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       __v:
 *                         type: integer
 *   delete:
 *     summary: Remove all game rooms
 *     tags: [GameRoom]
 *     responses:
 *       204:
 *         description: All game rooms removed successfully
 *       400:
 *         description: Bad request, could not delete game rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Could not delete game rooms"
 */
gameRoomRouter
  .route('/')
  .post(
    throwAuthErrorIfNotAuthenticated,
    asyncErrorCatch(gameRoomeController.create.bind(gameRoomeController)),
  )
  .get(asyncErrorCatch(gameRoomeController.getMany.bind(gameRoomeController)))
  .delete(
    asyncErrorCatch(gameRoomeController.removeAll.bind(gameRoomeController)),
  );

/**
 * @swagger
 * /api/v1/gamerooms/{id}:
 *   get:
 *     summary: Get a game room by ID
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the game room.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Game room found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 currentRound:
 *                   type: integer
 *                 hostUserId:
 *                   type: string
 *                 playerJoined:
 *                   type: array
 *                   items:
 *                     type: string
 *                 roundsTotal:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 teamSize:
 *                   type: integer
 *                 timePerRound:
 *                   type: integer
 *                 players:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       team:
 *                         type: integer
 *                       _id:
 *                         type: string
 *                 scores:
 *                   type: array
 *                   items:
 *                     type: object
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: integer
 *       404:
 *         description: Game room not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Game room not found."
 *   patch:
 *     summary: Update a game room
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the game room
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timePerRound:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Game room updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Game room not found
 *   delete:
 *     summary: Remove a game room
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the game room
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Game room removed successfully
 *       404:
 *         description: Game room not found
 */
gameRoomRouter
  .route('/:id')
  .get(asyncErrorCatch(gameRoomeController.getOne.bind(gameRoomeController)))
  .patch(
    throwAuthErrorIfNotAuthenticated,
    asyncErrorCatch(gameRoomeController.update.bind(gameRoomeController)),
  )
  .delete(
    throwAuthErrorIfNotAuthenticated,
    asyncErrorCatch(gameRoomeController.remove.bind(gameRoomeController)),
  );

/**
 * @swagger
 * /api/v1/gamerooms/{id}:
 *   get:
 *     summary: Get a game room by ID
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the game room
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the game room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Game room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Game room not found"
 *   patch:
 *     summary: Update a game room by ID
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the game room.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timePerRound:
 *                 type: integer
 *                 example: 2
 *                 description: New time per round in minutes.
 *     responses:
 *       200:
 *         description: Game room updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 currentRound:
 *                   type: integer
 *                 hostUserId:
 *                   type: string
 *                 playerJoined:
 *                   type: array
 *                   items:
 *                     type: string
 *                 roundsTotal:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 teamSize:
 *                   type: integer
 *                 timePerRound:
 *                   type: integer
 *                 players:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       team:
 *                         type: integer
 *                       _id:
 *                         type: string
 *                 scores:
 *                   type: array
 *                   items:
 *                     type: object
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: integer
 *       404:
 *         description: Game room not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Game room not found."
 *   delete:
 *     summary: Remove a game room
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the game room
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Game room removed successfully
 *       404:
 *         description: Game room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Game room not found"
 */
gameRoomRouter
  .route('/:roomId/room')
  .post(
    throwAuthErrorIfNotAuthenticated,
    asyncErrorCatch(
      gameRoomeController.leaveRoomOnWindowUnload.bind(gameRoomeController),
    ),
  )
  .patch(
    throwAuthErrorIfNotAuthenticated,
    asyncErrorCatch(gameRoomeController.joinRoom.bind(gameRoomeController)),
  )
  .delete(
    throwAuthErrorIfNotAuthenticated,
    asyncErrorCatch(gameRoomeController.leaveRoom.bind(gameRoomeController)),
  );

/**
 * @swagger
 * /api/v1/gamerooms/{roomId}/team:
 *   patch:
 *     summary: Join a team in a game room
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the game room
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamId:
 *                 type: string
 *                 example: "team123"
 *     responses:
 *       200:
 *         description: Successfully joined the team
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully joined the team."
 *                 teamId:
 *                   type: string
 *                   example: "team123"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid team ID."
 *       404:
 *         description: Game room or team not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Game room or team not found."
 */
gameRoomRouter
  .route('/:roomId/team')
  .patch(
    throwAuthErrorIfNotAuthenticated,
    asyncErrorCatch(gameRoomeController.joinTeam.bind(gameRoomeController)),
  );
