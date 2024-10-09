import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE } from '../../constants/constants';
import { GameRoomService } from '../gameRooms/GameRoomService';
import getManyGameRoomsSchema, {
  frontEndHomeSchemaDefault,
} from '../gameRooms/gameRoomValidaton';
import { Player } from '../gameRooms/types/gameRoom';

export class FrontEndController {
  constructor(private gameRoomService: GameRoomService) {
    this.gameRoomService = gameRoomService;
  }

  async getHome(req: Request, res: Response, next: NextFunction) {
    const { error, value } = getManyGameRoomsSchema.validate(req.query);

    const games = await this.gameRoomService.getMany(
      error ? frontEndHomeSchemaDefault : value,
    );

    const gamesWithTotalPlayers = games.map((game) => ({
      ...game,
      totalPlayers: game.playerJoined.length + game.players.length,
    }));

    const username = req.cookies?.username || 'Guest';

    res.render('home', {
      games: gamesWithTotalPlayers,
      title: 'Alias Game',
      username,
    });
  }

  async getGameLobby(req: Request, res: Response, next: NextFunction) {
    const gameId = req.params.id;

    try {
      const gameRoom = await this.gameRoomService.getOne(gameId);

      const team1: Player[] = [];
      const team2: Player[] = [];

      gameRoom.players.forEach((player: Player) => {
        if (player.team === 1) {
          team1.push(player);
        } else {
          team2.push(player);
        }
      });

      return res.render('gameLobby', {
        game: gameRoom,
        team1,
        team2,
        title: 'Game Lobby',
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return res.redirect('/');
    }
  }

  async getSingUpPage(req: Request, res: Response, next: NextFunction) {
    if (req.cookies.jwtToken) {
      res.redirect(HTTP_STATUS_CODE.REDIRECT_302, '/');
      return;
    }

    res
      .status(HTTP_STATUS_CODE.SUCCESS_200)
      .render('sign-up', { layout: 'main', pageTitle: 'Sign up' });
  }

  async getLogInPage(req: Request, res: Response, next: NextFunction) {
    if (req.cookies.jwtToken) {
      res.redirect(HTTP_STATUS_CODE.REDIRECT_302, '/');
      return;
    }

    res
      .status(HTTP_STATUS_CODE.SUCCESS_200)
      .render('log-in', { layout: 'main', pageTitle: 'Log in' });
  }
}
