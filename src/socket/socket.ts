import { Server, Socket } from 'socket.io';
import { SOCKET_EVENT } from '../constants/constants';

const mountGameLobbyMessageEvent = (socket: Socket, io: Server) => {
  socket.on(SOCKET_EVENT.GAME_LOBBY_MESSAGE, (data) => {
    const { roomId, message } = data;
    console.log('roomid', roomId);

    io.to(roomId).emit(SOCKET_EVENT.GAME_LOBBY_MESSAGE, message);
  });
};

const initializeSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`new connection: ${socket.id}`);

    mountGameLobbyMessageEvent(socket, io);

    socket.onAny((event) => {
      console.log(`got event: ${event}`);
    });

    socket.on('disconnect', () => {
      console.log(`socket disconnected: ${socket.id}`);
    });
  });
};

export { initializeSocket };
