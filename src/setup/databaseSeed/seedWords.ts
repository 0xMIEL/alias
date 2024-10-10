import { Word } from '../../entities/word/Word';
import * as fs from 'fs';
import * as path from 'path';


export const seedDatabase = async () => {
  try {
    // allows us to add words to words.json and automatically seed the database on every server start
    await Word.collection.drop();

    const jsonWordsPath = path.join(__dirname, 'words.json');
    const jsonWordFileContent = fs.readFileSync(jsonWordsPath, 'utf-8');
    const jsonWords = JSON.parse(jsonWordFileContent);

    await Word.insertMany(jsonWords);
    console.log('Words seeded successfully!');
    }
   catch (error) {
    console.error('Error seeding database:', error);
  }
};