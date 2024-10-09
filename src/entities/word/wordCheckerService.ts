import { AppError } from '../../core/AppError';
import { IWord } from './types/word';
import { Word } from './Word';
import {
  getRandomElement,
  calculateLevenshteinSimilarity,
  levenshtein,
} from './helpers/wordCheckerHelpers';
// import { Types } from 'mongoose';

export class WordCheckerService {
  private usedWords: Set<string> = new Set();

  constructor() {
  }

  async getAllWords(): Promise<IWord[]> {
    return Word.find();
  }

  async getRandomWord(): Promise<IWord> {
    const words = await Word.find(); // Pobierz wszystkie słowa
    const randomWord = getRandomElement(words, this.usedWords);

    if (!randomWord) {
      throw new AppError('No more words available or word list is empty.');
    }

    this.usedWords.add(randomWord.value);
    return randomWord; // Zwróć wylosowane słowo
  }

  async checkSimilarity(
    inputWord: IWord,
    targetWord: IWord,
  ): Promise<number> {
    if (!inputWord || !targetWord) {
      throw new AppError('Both input and target words must be provided.');
    }
    const similarity = await calculateLevenshteinSimilarity(
      inputWord.value,
      targetWord.value,
    );

    return similarity;
  }

  // Returns true if the similarity between the input word and the target word is greater than or equal to the threshold, no endpoint yet
  async isSimilarEnough(
    inputWord: IWord,
    targetWord: IWord,
    threshold: number,
  ): Promise<boolean> {
    const similarity = await this.checkSimilarity(inputWord, targetWord);
    return similarity >= threshold;
  }

  async checkSentenceForWord(word: IWord, sentence: string): Promise<boolean> {
    const words = sentence.split(/\s+/); // Podziel zdanie na słowa
    for (const sentenceWord of words) {
      const distance = await levenshtein(word.value, sentenceWord); // Oblicz odległość Levenshteina
      if (distance <= 1) {
        return true; // Wykryto oszustwo
      }
    }
    return false; // Nie wykryto oszustwa
  }
}
