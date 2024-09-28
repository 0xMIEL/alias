import { Router } from 'express';
import { BookController } from './bookController';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { BookService } from './bookService';
import { Book } from './Book';

export const bookRouter = Router();

const bookService = new BookService(Book);
const bookController = new BookController(bookService);

// każda metoda est zapakowana w asyncErrorCatch, dzięki temu nie musimy używać try catch
bookRouter
  .route('/')
  .get(asyncErrorCatch(bookController.getAll.bind(bookController)))
  .post(asyncErrorCatch(bookController.create.bind(bookController)));

bookRouter.route('/:id').get(asyncErrorCatch(bookController.getOne.bind(bookController)));
