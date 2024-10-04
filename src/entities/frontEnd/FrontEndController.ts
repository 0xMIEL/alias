import { NextFunction, Request, Response } from 'express';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { gameRoomStatuses, Player } from '../gameRooms/types/gameRoom';

type GetManyGameRoomsFilters = {
  status?: string;
  teamSize?: string;
  timePerRound?: string;
};

export class FrontEndController {
  constructor(private gameRoomService: GameRoomService) {
    this.gameRoomService = gameRoomService;
  }

  async getHome(req: Request, res: Response, next: NextFunction) {
    const { status, teamSize, timePerRound } = req.query;

    const filters: GetManyGameRoomsFilters = {
      status: (status as string) || gameRoomStatuses.lobby,
    };

    if (teamSize) {
      filters.teamSize = teamSize as string;
    }
    if (timePerRound) {
      filters.timePerRound = timePerRound as string;
    }

    const openGames = await this.gameRoomService.getMany(filters);

    res.render('home', {
      BASE_URL: process.env.BASE_URL,
      games: openGames,
      title: 'Alias Game',
    });
  }

  async getGameLobby(req: Request, res: Response, next: NextFunction) {
    const gameId = req.params.id;

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

    res.render('gameLobby', {
      game: gameRoom,
      team1,
      team2,
      title: 'Game Lobby',
    });
  }
}
