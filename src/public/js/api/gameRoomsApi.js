import { baseUrl } from '../setup/config.js';

/* eslint-disable no-console */

async function createGameRoom({ gameData }) {
  try {
    const response = await fetch(`${baseUrl}/gameRooms`, {
      body: JSON.stringify(gameData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function updateGameRoom({ data, id }) {
  try {
    const response = await fetch(`${baseUrl}/gameRooms/${id}`, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function addPlayer({ data, id }) {
  const url = `${baseUrl}/gameRooms/${id}/player`;
  console.log(url);

  try {
    const response = await fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function removePlayer({ playerId, id }) {
  try {
    const response = await fetch(
      `${baseUrl}/gameRooms/${id}/player/${playerId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export { removePlayer, createGameRoom, addPlayer, updateGameRoom };
