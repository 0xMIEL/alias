import { TOTAL_TEAMS } from '../constants/constants';
import { IGameRoom } from '../entities/gameRooms/types/gameRoom';

export function isGameRoomFull(gameRoom: IGameRoom) {
  return (
    gameRoom.team1.players.length + gameRoom.team2.players.length >=
    gameRoom.teamSize * TOTAL_TEAMS
  );
}
