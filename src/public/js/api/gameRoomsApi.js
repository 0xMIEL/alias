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

const addPlayer = apiRequestErrorCatch(async ({ data, id }) => {
  return await makeApiRequest({
    data: data,
    method: HTTP_METHODS.PATCH,
    url: `${baseUrl}/gameRooms/${id}/player`,
  });
});

const removePlayer = apiRequestErrorCatch(async ({ playerId, id }) => {
  return await makeApiRequest({
    method: HTTP_METHODS.DELETE,
    url: `${baseUrl}/gameRooms/${id}/player/${playerId}`,
  });
});

export { removePlayer, createGameRoom, addPlayer, updateGameRoom };
