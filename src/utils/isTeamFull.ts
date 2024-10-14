import { IGameRoom } from '../entities/gameRooms/types/gameRoom';

export function isTeamFull(gameRoom: IGameRoom, team: number) {
  const { players } = gameRoom[`team${team}` as 'team1' | 'team2'];
  const { teamSize } = gameRoom;

  return players.length >= teamSize;
}
