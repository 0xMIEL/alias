import { Router } from 'express';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { GameRoomService } from './GameRoomService';
import { GameRoom } from './GameRoom';
import { GameRoomController } from './GameRoomController';
import { validateId } from '../../middleware/validateId';

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
 *             properties:
 *               name:
 *                 type: string
 *               maxPlayers:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Game room created successfully
 *       400:
 *         description: Bad request
 *   get:
 *     summary: Get all game rooms
 *     tags: [GameRoom]
 *     responses:
 *       200:
 *         description: A list of game rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   maxPlayers:
 *                     type: integer
 *   delete:
 *     summary: Remove all game rooms
 *     tags: [GameRoom]
 *     responses:
 *       204:
 *         description: All game rooms removed successfully
 */
gameRoomRouter
  .route('/')
  .post(asyncErrorCatch(gameRoomeController.create.bind(gameRoomeController)))
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
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 maxPlayers:
 *                   type: integer
 *       404:
 *         description: Game room not found
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
 *               name:
 *                 type: string
 *               maxPlayers:
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
  .patch(asyncErrorCatch(gameRoomeController.update.bind(gameRoomeController)))
  .delete(
    asyncErrorCatch(gameRoomeController.remove.bind(gameRoomeController)),
  );

/**
 * @swagger
 * /api/v1/gamerooms/{roomId}/room/{playerId}:
 *   post:
 *     summary: Remove a player on window unload
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the game room
 *         schema:
 *           type: string
 *       - in: path
 *         name: playerId
 *         required: true
 *         description: The ID of the player
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player removed successfully
 *       404:
 *         description: Game room or player not found
 *   patch:
 *     summary: Join a game room
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the game room
 *         schema:
 *           type: string
 *       - in: path
 *         name: playerId
 *         required: true
 *         description: The ID of the player
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player joined successfully
 *       404:
 *         description: Game room or player not found
 *   delete:
 *     summary: Leave a game room
 *     tags: [GameRoom]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The ID of the game room
 *         schema:
 *           type: string
 *       - in: path
 *         name: playerId
 *         required: true
 *         description: The ID of the player
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player left successfully
 *       404:
 *         description: Game room or player not found
 */  
gameRoomRouter
  .route('/:roomId/room/:playerId')
  .post(
    asyncErrorCatch(
      gameRoomeController.removePlayerOnWindowUnload.bind(gameRoomeController),
    ),
  )
  .patch(
    asyncErrorCatch(gameRoomeController.joinRoom.bind(gameRoomeController)),
  )
  .delete(
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
 *     responses:
 *       200:
 *         description: Successfully joined the team
 *       404:
 *         description: Game room or team not found
 */
gameRoomRouter
  .route('/:roomId/team')
  .patch(
    asyncErrorCatch(gameRoomeController.joinTeam.bind(gameRoomeController)),
  );
