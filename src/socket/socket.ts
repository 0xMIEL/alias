import { Server, Socket } from 'socket.io';
import { SOCKET_EVENT } from '../constants/constants';
import { gameHistoryService } from '../entities/gameHistory/GameHistoryService';
import { mountGameEvents } from '../gameLogic/game';
import { socketAuth } from './socketAuth';

const mountGameLobbyMessageEvent = (socket: Socket, io: Server) => {
  socket.on(SOCKET_EVENT.GAME_LOBBY_MESSAGE, ({ roomId, message }) => {
    const sender = socket.user!;

    gameHistoryService.storeMessage(
      roomId,
      sender._id,
      sender.username,
      message,
    );

    io.to(roomId).emit(SOCKET_EVENT.GAME_LOBBY_MESSAGE, {
      message,
      username: sender.username,
    });
  });
};

const mountJoinGameLobbyEvent = (socket: Socket) => {
  socket.on(SOCKET_EVENT.JOIN_ROOM, ({ roomId }) => {
    socket.join(roomId);
  });
};

const mountJoinGameEvent = (socket: Socket) => {
  socket.on(SOCKET_EVENT.JOIN_GAME, ({ roomId }) => {
    socket.join(roomId);
  });
};

const initializeSocket = (io: Server) => {
  io.use(socketAuth);
  io.on('connection', (socket) => {
    mountGameLobbyMessageEvent(socket, io);
    mountJoinGameLobbyEvent(socket);
    mountJoinGameEvent(socket);
    mountGameEvents(socket, io);
  });
};

export { initializeSocket };
