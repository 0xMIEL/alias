import mongoose from 'mongoose';
import { IGameRoom } from '../entities/gameRooms/types/gameRoom';

export function isUserInRoom(gameRoom: IGameRoom, userId: string) {
  const { team1, team2, playerJoined } = gameRoom;

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const isInPlayerJoined = playerJoined.includes(userObjectId);
  const isInTeam1 = team1.players.includes(userObjectId);
  const isInTeam2 = team2.players.includes(userObjectId);

  return isInPlayerJoined || isInTeam1 || isInTeam2;
}
