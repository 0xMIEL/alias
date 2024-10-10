import { baseUrl } from '../setup/config.js';
import {
  apiRequestErrorCatch,
  HTTP_METHODS,
  makeApiRequest,
} from './apiUtils.js';

const createGameRoom = apiRequestErrorCatch(async ({ gameData }) => {
  return await makeApiRequest({
    data: gameData,
    method: HTTP_METHODS.POST,
    url: `${baseUrl}/gameRooms`,
  });
});

const updateGameRoom = apiRequestErrorCatch(async ({ data, id }) => {
  return await makeApiRequest({
    data: data,
    method: HTTP_METHODS.PATCH,
    url: `${baseUrl}/gameRooms/${id}`,
  });
});

const joinRoom = apiRequestErrorCatch(async ({ data, id }) => {
  return await makeApiRequest({
    data,
    method: HTTP_METHODS.PATCH,
    url: `${baseUrl}/gameRooms/${id}/room/${data.userId}`,
  });
});

const joinTeam = apiRequestErrorCatch(async ({ data, id }) => {
  const url = `${baseUrl}/gameRooms/${id}/team`;

  return await makeApiRequest({
    data: data,
    method: HTTP_METHODS.PATCH,
    url,
  });
});

const leaveRoom = apiRequestErrorCatch(async ({ playerId, gameId }) => {
  return await makeApiRequest({
    method: HTTP_METHODS.DELETE,
    url: `${baseUrl}/gameRooms/${gameId}/room/${playerId}`,
  });
});

const startGame = apiRequestErrorCatch(async ( {gameData}) => {
  return await makeApiRequest({
    data: gameData,
    method: HTTP_METHODS.POST,
    url: `${baseUrl}/startGame`,
  });
});

export { leaveRoom, createGameRoom, joinRoom, updateGameRoom, joinTeam, startGame };
