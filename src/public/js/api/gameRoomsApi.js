/* eslint-disable no-console */
export async function createGameRoom(gameData, url) {
  try {
    const response = await fetch(url, {
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
