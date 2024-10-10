import { Word } from '../../entities/word/Word';
import * as fs from 'fs';
import * as path from 'path';
import { AppError } from '../../core/AppError';
import { HTTP_STATUS_CODE } from '../../constants/constants';


export const seedDatabase = async () => {
  try {
    // allows us to add words to words.json and automatically seed the database on every server start
    await Word.collection.drop();

    const jsonWordsPath = path.join(__dirname, 'words.json');
    const jsonWordFileContent = fs.readFileSync(jsonWordsPath, 'utf-8');
    const jsonWords = JSON.parse(jsonWordFileContent);

    await Word.insertMany(jsonWords);
    }
   catch (error) {
    throw new AppError(`Error seeding database: ${error}`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_500);
  }
};