import { baseUrl } from '../setup/config.js';
import {
  apiRequestErrorCatch,
  HTTP_METHODS,
  makeApiRequest,
} from './apiUtils.js';

const logoutUser = apiRequestErrorCatch(async () => {
  return await makeApiRequest({
    credentials: 'include',
    method: HTTP_METHODS.DELETE,
    url: `${baseUrl}/users/logout`,
  });
});

export { logoutUser };
