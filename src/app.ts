import express from 'express';
import dontenv from 'dotenv';
import { connect } from './setup/database.js';

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);

  process.exit(1);
});

dontenv.config({ path: '.env' });
export const app = express();

// connect database
connect();

// body parser
app.use(express.json());

app.get('/', (req, res, next) => {
  res.json({
    message: 'Hello world',
    status: 'success',
  });
});
