import { Server, Socket } from 'socket.io';
import { SOCKET_EVENT } from '../constants/constants';
import { gameHistoryService } from '../entities/gameHistory/GameHistoryService';
import { mountGameEvents } from '../gameLogic/game';
import { socketAuth } from './socketAuth';

const mountGameLobbyMessageEvent = (socket: Socket, io: Server) => {
  const { username, _id } = socket.user!;
  socket.on(SOCKET_EVENT.GAME_LOBBY_MESSAGE, async ({ roomId, message }) => {
    const newMessage = await gameHistoryService.storeMessage(
      roomId,
      _id,
      username,
      message,
    );
    io.to(roomId).emit(SOCKET_EVENT.GAME_LOBBY_MESSAGE, {
      createdAt: newMessage.createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Warsaw',
      }),
      message,
      text: message,
      username,
    });
  });
};

const mountJoinGameLobbyEvent = (socket: Socket) => {
  socket.on(SOCKET_EVENT.JOIN_ROOM, ({ roomId }) => {
    socket.join(roomId);
  });
};

const initializeSocket = (io: Server) => {
  io.use(socketAuth);
  io.on('connection', (socket) => {
    mountGameLobbyMessageEvent(socket, io);
    mountJoinGameLobbyEvent(socket);
    mountGameEvents(socket, io);
  });
};

export { initializeSocket };
