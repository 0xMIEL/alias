/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { WordCheckerService } from '../wordCheckerService';
import { IWord } from '../types/word';
import { Word } from '../Word';
import { AppError } from '../../../core/AppError';
import {
  calculateLevenshteinSimilarity,
  levenshtein,
  getRandomElement,
} from '../helpers/wordCheckerHelpers';

jest.mock('../Word'); 
jest.mock('../helpers/wordCheckerHelpers');

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('WordCheckerService', () => {
  let wordCheckerService: WordCheckerService;

  beforeEach(() => {
    wordCheckerService = new WordCheckerService();
    jest.clearAllMocks(); 
  });

  describe('getRandomWord', () => {
    it('should return a random word', async () => {
      const mockWords: IWord[] = [
        { _id: '1', value: 'apple' } as IWord,
        { _id: '2', value: 'banana' } as IWord,
      ];

      (Word.find as jest.Mock).mockResolvedValue(mockWords);
      (getRandomElement as jest.Mock).mockReturnValue(mockWords[0]);

      const randomWord = await wordCheckerService.getRandomWord();
      expect(randomWord).toEqual(mockWords[0]);
      expect(getRandomElement).toHaveBeenCalledWith(mockWords, expect.any(Set));
    });

    it('should throw an error if no words are available', async () => {
      (Word.find as jest.Mock).mockResolvedValue([]);
      await expect(wordCheckerService.getRandomWord()).rejects.toThrow(AppError);
      await expect(wordCheckerService.getRandomWord()).rejects.toThrow('No more words available or word list is empty.');
    });
  });

  describe('checkSimilarity', () => {
    it('should return a similarity score', async () => {
      const inputWord: IWord = { _id: '1', value: 'cat' } as IWord;
      const targetWord: IWord = { _id: '2', value: 'bat' } as IWord;

      (calculateLevenshteinSimilarity as jest.Mock).mockResolvedValue(0.8);

      const similarity = await wordCheckerService.checkSimilarity(inputWord, targetWord);
      expect(similarity).toBe(0.8);
      expect(calculateLevenshteinSimilarity).toHaveBeenCalledWith('cat', 'bat');
    });

    it('should throw an error if input or target word is missing', async () => {
      const inputWord: IWord = { _id: '1', value: 'cat' } as IWord;

      await expect(
        wordCheckerService.checkSimilarity(inputWord, null as any),
      ).rejects.toThrow(AppError);
      await expect(
        wordCheckerService.checkSimilarity(inputWord, null as any),
      ).rejects.toThrow('Both input and target words must be provided.');
    });
  });

  describe('isSimilarEnough', () => {
    it('should return true if similarity is greater than or equal to threshold', async () => {
      const inputWord: IWord = { _id: '1', value: 'cat' } as IWord;
      const targetWord: IWord = { _id: '2', value: 'bat' } as IWord;

      (calculateLevenshteinSimilarity as jest.Mock).mockResolvedValue(0.8);

      const isSimilar = await wordCheckerService.isSimilarEnough(inputWord, targetWord, 0.75);
      expect(isSimilar).toBe(true);
    });

    it('should return false if similarity is less than threshold', async () => {
      const inputWord: IWord = { _id: '1', value: 'cat' } as IWord;
      const targetWord: IWord = { _id: '2', value: 'bat' } as IWord;

      (calculateLevenshteinSimilarity as jest.Mock).mockResolvedValue(0.6);

      const isSimilar = await wordCheckerService.isSimilarEnough(inputWord, targetWord, 0.75);
      expect(isSimilar).toBe(false);
    });
  });

  describe('checkSentenceForWord', () => {
    it('should return true if word is found in the sentence with a small edit distance', async () => {
      const word: IWord = { _id: '1', value: 'apple' } as IWord;
      const sentence = 'aple';
      
      (levenshtein as jest.Mock).mockResolvedValue(1); // Zmieniono na poprawne mockowanie
      const isInSentence = await wordCheckerService.checkSentenceForWord(word, sentence);
      expect(isInSentence).toBe(true);
      expect(levenshtein).toHaveBeenCalledWith('apple', 'aple');
    });

    it('should return false if word is not found in the sentence', async () => {
      const word: IWord = { value: 'apple' } as IWord;
      const sentence = 'I like eating bananas every day.';

      (levenshtein as jest.Mock).mockResolvedValue(3);

      const isInSentence = await wordCheckerService.checkSentenceForWord(word, sentence);
      expect(isInSentence).toBe(false);
      expect(levenshtein).toHaveBeenCalledWith('apple', 'bananas');
    });
  });
});

