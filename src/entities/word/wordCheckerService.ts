import { AppError } from '../../core/AppError';
import { IWord } from './types/word';
import { Word } from './Word';
import {
  getRandomElement,
  calculateLevenshteinSimilarity,
  levenshtein,
} from './helpers/wordCheckerHelpers';
import { wordConstants } from './constants/wordConstants';
// import { Types } from 'mongoose';

export class WordCheckerService {
  private usedWords: Set<string> = new Set();

  constructor() {}

  async addWords(words: IWord[]): Promise<IWord[]> {
    const newWords = await Word.insertMany(words);
    return newWords;
  }

  async addWord(word: IWord): Promise<IWord> {
    const newWord = await Word.create(word);
    return newWord;
  }

  async deleteWordById(id: string): Promise<void> {
    await Word.findByIdAndDelete(id);
  }

  async updateWordById(id: string, updateData: Partial<IWord>): Promise<IWord> {
    const word = await Word.findById(id);
    if (!word) {
      throw new AppError('Word not found.');
    }

    // Aktualizacja danych
    word.value = updateData.value || word.value;
    word.category = updateData.category || word.category;
    word.difficulty = updateData.difficulty || word.difficulty;
    await word.save();
    return word;
  }

  async getAllWords(): Promise<IWord[]> {
    return Word.find();
  }

  async getRandomWordDev(): Promise<IWord> {
    const words = await Word.find();
    const randomWord = getRandomElement(words, this.usedWords);

    if (words.length === 0 || !randomWord) {
      throw new AppError('No more words available or word list is empty.');
    }

    this.usedWords.add(randomWord.value);
    return randomWord;
  }

  async getRandomWord(difficulty: string): Promise<IWord> {
    if (![ 
      wordConstants.WORD_DIFFICULTY.EASY, 
      wordConstants.WORD_DIFFICULTY.MEDIUM, 
      wordConstants.WORD_DIFFICULTY.HARD 
    ].includes(difficulty)) {
      throw new AppError('Invalid difficulty level.');
    }

    const words = await Word.find({ difficulty });
    const randomWord = getRandomElement(words, this.usedWords);

    if (words.length === 0 || !randomWord) {
      throw new AppError('No more words available or word list is empty.');
    }

    this.usedWords.add(randomWord.value);
    return randomWord;
  }

  async checkSimilarity(
    inputWord: IWord,
    targetWord: IWord,
  ): Promise<number> {
    if (!inputWord || !targetWord) {
      throw new AppError('Both input and target words must be provided.');
    }

    const similarity = await calculateLevenshteinSimilarity(
      inputWord.value.trim(),
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
    const words = sentence.split(/\s+/);
    for (const sentenceWord of words) {
      const distance = await levenshtein(word.value, sentenceWord);
      if (distance <= 1) {
        return true;
      }
    }
    return false;
  }
}
