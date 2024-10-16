import { Server } from 'socket.io';
import { SOCKET_EVENT } from '../constants/constants';
import {
  gameRoomStatuses,
  IGameRoom,
} from '../entities/gameRooms/types/gameRoom';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';
import { UserService } from '../entities/users/UserService';
import { saveUsersGameData } from './helpers/helpers';
import { PlayersMap } from './game';

type EndGameProps = {
  gameRoom: IGameRoom;
  io: Server;
  gameRoomService: GameRoomService;
  userService: UserService;
  players: PlayersMap;
};

async function endGame({
  gameRoom,
  io,
  gameRoomService,
  userService,
  players,
}: EndGameProps) {
  const gameRoomId = gameRoom._id.toString();
  await gameRoomService.update(
    { status: gameRoomStatuses.finished },
    gameRoomId,
  );

  io.in(gameRoomId).emit(SOCKET_EVENT.END_GAME, gameRoom);

  saveUsersGameData(gameRoom, userService);

  io.in(gameRoomId).emit(SOCKET_EVENT.GAME_SUMMARY, gameRoom);

  players.delete(gameRoomId);
}
export { endGame };
