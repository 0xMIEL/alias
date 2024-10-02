/* eslint-disable no-console */

import { server } from './app';

const defaultPort = 3000;
const port = process.env.PORT || defaultPort;

server.listen(port, () => {
  console.log(`Server listen port: ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});
