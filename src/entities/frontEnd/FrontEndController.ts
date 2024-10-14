import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE } from '../../constants/constants';
import { AppError } from '../../core/AppError';
import { isGameRoomFull } from '../../utils/isGameRoomFull';
import { gameHistoryService } from '../gameHistory/GameHistoryService';
import { GameRoomService } from '../gameRooms/GameRoomService';
import getManyGameRoomsSchema from '../gameRooms/gameRoomValidaton';
import { UserService } from '../users/UserService';

export class FrontEndController {
  constructor(
    private gameRoomService: GameRoomService,
    private userService: UserService,
  ) {
    this.gameRoomService = gameRoomService;
    this.userService = userService;
  }

  async getHome(req: Request, res: Response, next: NextFunction) {
    const { error, value } = getManyGameRoomsSchema.validate(req.query, {
      stripUnknown: true,
    });
    const user = req.user!;

    if (error) {
      throw new AppError(error.message);
    }

    const games = await this.gameRoomService.getMany(value);

    const gamesWithTotalPlayers = games.map((game) => ({
      ...game,
      totalPlayers:
        game.playerJoined.length +
        game.team1.players.length +
        game.team2.players.length,
    }));

    res.render('home', {
      games: gamesWithTotalPlayers,
      title: 'Alias Game',
      username: user.username,
    });
  }

  async getGameLobby(req: Request, res: Response, next: NextFunction) {
    const gameId = req.params.id;
    const user = req.user!;

    try {
      const gameRoom = await this.gameRoomService.getOne(gameId);
      const messages = await gameHistoryService.getAllMessages(gameId);

      const { players: team1Players } = gameRoom.team1;
      const { players: team2Players } = gameRoom.team2;

      const isHost = gameRoom.hostUserId.toString() === user._id.toString();

      const sortedMessages = messages.map((m) => {
        return {
          createdAt: m.createdAt.toLocaleTimeString('en-US', {
            hour: '2-digit',
            hour12: false,
            minute: '2-digit',
            second: '2-digit',
          }),
          isYours: m.userId === user._id.toString(),
          text: m.text,
          username: m.username,
        };
      });

      return res.render('gameLobby', {
        game: gameRoom,
        isHost,
        isTeamsFull: isGameRoomFull(gameRoom),
        messages,
        sortedMessages,
        team1: team1Players,
        team2: team2Players,
        title: 'Game Lobby',
        username: user.username,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.redirect('/');
    }
  }

  async getSingUpPage(req: Request, res: Response, next: NextFunction) {
    res
      .status(HTTP_STATUS_CODE.SUCCESS_200)
      .render('sign-up', { layout: 'main', pageTitle: 'Sign up' });
  }

  async getLogInPage(req: Request, res: Response, next: NextFunction) {
    res
      .status(HTTP_STATUS_CODE.SUCCESS_200)
      .render('log-in', { layout: 'main', pageTitle: 'Log in' });
  }

  async getInGame(req: Request, res: Response, next: NextFunction) {
    const gameRoom = await this.gameRoomService.getOne(req.params.id);
    const user = req.user!;

    const team1Users = await this.userService.getUsersByIds(
      gameRoom.team1.players.map((el) => el.toString()),
    );
    const team2Users = await this.userService.getUsersByIds(
      gameRoom.team2.players.map((el) => el.toString()),
    );
    const totalPlayersInTeam = team2Users.length;

    const team1Usernames = team1Users.map((player) => player.username);
    const team2Usernames = team2Users.map((player) => player.username);
    res.render('in-game', {
      gameRoom,
      team1Usernames,
      team2Usernames,
      title: 'Alias Game',
      totalPlayersInTeam,
      username: user.username,
    });
  }
}
