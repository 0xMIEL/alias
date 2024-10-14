import { Server } from 'socket.io';
import { SOCKET_EVENT } from '../constants/constants';
import {
  gameRoomStatuses,
  IGameRoom,
} from '../entities/gameRooms/types/gameRoom';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';
// import { UserService } from '../entities/users/UserService'; 

async function endGame(
  gameRoom: IGameRoom,
  io: Server,
  gameRoomService: GameRoomService, 
  // userService: UserService,
) {
  await gameRoomService.update(
    { status: gameRoomStatuses.finished },
    gameRoom._id.toString(),
  );

  io.in(gameRoom._id.toString()).emit(SOCKET_EVENT.END_GAME, gameRoom);

  // const players = [...gameRoom.team1.players, ...gameRoom.team2.players];


  // for (const playerId of players) {

  //   const userProfile = await userService.getOneById(playerId.toString());

  //   const newGameHistoryEntry = { gameId: gameRoom._id, outcome: 'unknown' };

  //   const updatedGameHistory = [...userProfile.gameHistory, newGameHistoryEntry];

  //   await userService.updateUserProfile(
  //     playerId.toString(), 
  //     { gameHistory: updatedGameHistory } 
  //   );
  // }
}
export { endGame };
