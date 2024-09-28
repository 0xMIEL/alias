import { Types } from 'mongoose';
import { AppError } from '../../core/AppError';
import { BookModel, IBook } from './Book';

export class BookService {
  constructor(private Book: BookModel) {
    this.Book = Book;
  }

  async createBook(data: IBook): Promise<IBook> {
    const book = new this.Book(data);
    await book.save();

    return book;
  }

  async getManyBooks(): Promise<IBook[]> {
    // chęsto jest getAll ale nie zawszy chcemy wszystkie recordy
    return await this.Book.find();
  }

  async getBookById(id: string): Promise<IBook | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid id format: ${id}`);
    }

    const book = await this.Book.findById(id);

    if (!book) {
      throw new AppError(`There is no book with id: ${id}`);
    }

    return book;
  }
}
