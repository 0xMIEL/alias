import { joinGameWithSocket } from '../sockets/socketHandlers.js';
import { registerGameSocketListeners } from '../sockets/socketListeners.js';
import { handleGameMessageSend } from './helpers.js';

const roomId = document.getElementById('in-game').getAttribute('data-game-id');

const chatSendButton = document.getElementById('chat-send-button');

chatSendButton.addEventListener('click', (e) =>
  handleGameMessageSend(e, roomId),
);

document.addEventListener('DOMContentLoaded', () => {
  joinGameWithSocket(roomId);
  registerGameSocketListeners(roomId);
});
