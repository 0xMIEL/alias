import { NextFunction, Request, Response } from 'express';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { gameRoomStatuses } from '../gameRooms/types/gameRoom';

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
    const userId = req.query.player;
    const gameId = req.params.id;

    console.log(userId);
    console.log(gameId);

    res.render('gameLobby', { title: 'Game Lobby' });
  }
}
