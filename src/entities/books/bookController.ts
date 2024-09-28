import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes';
import { BookService } from './bookService';

export class BookController {
  constructor(private bookService: BookService) {
    this.bookService = bookService;
  }

  async create(req: Request, res: Response, next: NextFunction) {
    // zawszy dodajemy next dla asyncErrorCatch
    const bookData = req.body;

    const newBook = await this.bookService.createBook(bookData);

    // można się zastanowić nad zrobieniem metody która bedzie wysyłać response bo powtażamy się
    res.status(HTTP_STATUS_CODES.CREATED_201).json({
      data: newBook, // wszystkie dane zawszy wysyłamy przez data
      status: 'success', // będziemy mieli zawsze albo success albo error, łatwo jest sprawdzić we frontie czy jest wszystko git
    });
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    const books = await this.bookService.getManyBooks();

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: books, // wszystkie dane zawszy wysyłamy przez data
      status: 'success', // będziemy mieli zawsze albo success albo error, łatwo jest sprawdzić we frontie czy jest wszystko git
    });
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    const book = await this.bookService.getBookById(id);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: book,
      status: 'success',
    });
  }
}
