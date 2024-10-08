import { NextFunction, Request, Response } from 'express';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { Player } from '../gameRooms/types/gameRoom';
import getManyGameRoomsSchema, {
  frontEndHomeSchemaDefault,
} from '../gameRooms/gameRoomValidaton';

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

    res.render('home', {
      games: gamesWithTotalPlayers,
      title: 'Alias Game',
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
}
