import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE } from '../../constants/constants';
import { GameRoomService } from '../gameRooms/GameRoomService';
import getManyGameRoomsSchema, {
  frontEndHomeSchemaDefault,
} from '../gameRooms/gameRoomValidaton';
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
    const { error, value } = getManyGameRoomsSchema.validate(req.query);
    const user = req.user!;

    const games = await this.gameRoomService.getMany(
      error ? frontEndHomeSchemaDefault : value,
    );

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

      return res.render('gameLobby', {
        game: gameRoom,
        team1: gameRoom.team1.players,
        team2: gameRoom.team2.players,
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
      gameRoom.team1.players,
    );
    const team2Users = await this.userService.getUsersByIds(
      gameRoom.team2.players,
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