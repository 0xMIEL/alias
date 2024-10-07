/* eslint-disable no-console */
function apiRequestErrorCatch(apiCall) {
  return async function (...args) {
    try {
      return apiCall(...args);
    } catch (error) {
      console.log(`API call fail: ${error.message}`);
    }
  };
}

async function makeApiRequest({ method, url, data = null }) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: `${method}`,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  const noContentStatusCode = 204;
  if (response.status === noContentStatusCode) {
    return;
  }

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  return await response.json();
}

const HTTP_METHODS = {
  DELETE: 'DELETE',
  GET: 'GET',
  PATCH: 'PATCH',
  POST: 'POST',
};

export { HTTP_METHODS, makeApiRequest, apiRequestErrorCatch };
