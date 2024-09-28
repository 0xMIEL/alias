import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  publishedYear: number;
  genre: string;
}

const authorNameMinLength = 2; // no magic numbers

const bookSchema: Schema<IBook> = new Schema({
  author: {
    minlength: [authorNameMinLength, 'Author name must be at least 2 characters long'],
    required: [true, 'Author is required'],
    type: String,
  },
  genre: {
    enum: {
      message: '{VALUE} is not a valid genre',
      values: ['Fiction', 'Non-Fiction', 'Mystery', 'Fantasy', 'Science Fiction', 'Biography'],
    },
    required: [true, 'Genre is required'],
    type: String,
  },
  publishedYear: {
    max: [new Date().getFullYear(), 'Published Year cannot be in the future'], // Maximum value validation
    required: [true, 'Published Year is required'],
    type: Number,
  },
  title: {
    required: [true, 'Title is required'],
    type: String,
  },
});

export const Book = mongoose.model<IBook>('Book', bookSchema);
export type BookModel = typeof Book;
