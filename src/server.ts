/* eslint-disable no-console */
import { app } from './app';

const defaultPort = 3000;
const port = process.env.PORT || defaultPort;

const server = app.listen(port, () => {
  console.log(`Server listen port: ${port}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});
