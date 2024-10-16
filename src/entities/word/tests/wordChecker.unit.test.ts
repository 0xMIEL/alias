/* eslint-disable sort-keys */
import { WordCheckerService } from '../wordCheckerService';
import { Word } from '../Word';
import { AppError } from '../../../core/AppError';
import { IWord } from '../types/word';

jest.mock('../Word');

describe('wordCheckerService', () => {
    let service: WordCheckerService;

    beforeEach(() => {
        service = new WordCheckerService();
        jest.clearAllMocks();
    });

    describe('addWords', () => {
        it('should add words successfully', async () => {
            const words: IWord[] = [
                { category: 'fruit', difficulty: 'easy', value: 'banana', _id: '1' } as IWord,
                { category: 'vegetable', difficulty: 'medium', value: 'carrot', _id: '2' } as IWord,
            ];

            (Word.insertMany as jest.Mock).mockResolvedValue(words);

            const result = await service.addWords(words);

            expect(result).toEqual(words);
            expect(Word.insertMany).toHaveBeenCalledWith(words);
        });
    });

    describe('addWord', () => {
        it('should add a word successfully', async () => {
            const word: IWord = { category: 'fruit', difficulty: 'easy', value: 'banana', _id: '1' } as IWord;

            (Word.create as jest.Mock).mockResolvedValue(word);

            const result = await service.addWord(word);

            expect(result).toEqual(word);
            expect(Word.create).toHaveBeenCalledWith(word);
        });
    });

    describe('deleteWordById', () => {
        it('should delete a word by ID', async () => {
            const id = '1';

            (Word.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            await service.deleteWordById(id);

            expect(Word.findByIdAndDelete).toHaveBeenCalledWith(id);
        });
    });

    describe('updateWordById', () => {
        it('should update a word by ID', async () => {
            const id = '1';
            const updateData: Partial<IWord> = { value: 'apple' };
            const existingWord: IWord = { category: 'fruit', difficulty: 'easy', value: 'banana', _id: id } as IWord;

            (Word.findById as jest.Mock).mockResolvedValue(existingWord);
            existingWord.save = jest.fn().mockResolvedValue(existingWord);

            const result = await service.updateWordById(id, updateData);

            expect(result).toEqual(existingWord);
            expect(Word.findById).toHaveBeenCalledWith(id);
            expect(existingWord.value).toBe('apple');
        });

        it('should throw an error if word is not found', async () => {
            const id = '1';
            const updateData: Partial<IWord> = { value: 'apple' };

            (Word.findById as jest.Mock).mockResolvedValue(null);

            await expect(service.updateWordById(id, updateData)).rejects.toThrow(AppError);
        });
    });

    describe('getAllWords', () => {
        it('should return all words', async () => {
            const words: IWord[] = [
                { category: 'fruit', difficulty: 'easy', value: 'banana', _id: '1' } as IWord,
            ];

            (Word.find as jest.Mock).mockResolvedValue(words);

            const result = await service.getAllWords();

            expect(result).toEqual(words);
            expect(Word.find).toHaveBeenCalled();
        });
    });

    describe('getRandomWord', () => {
        it('should return a random word for a given difficulty', async () => {
            const word: IWord = { category: 'fruit', difficulty: 'easy', value: 'banana', _id: '1' } as IWord;

            (Word.find as jest.Mock).mockResolvedValue([word]);

            const result = await service.getRandomWord('easy');

            expect(result).toEqual(word);
            expect(Word.find).toHaveBeenCalledWith({ difficulty: 'easy' });
        });

        it('should throw an error for invalid difficulty', async () => {
            await expect(service.getRandomWord('invalid')).rejects.toThrow(AppError);
        });
    });

    describe('checkSimilarity', () => {
        it('should return similarity score between two words', async () => {
            const inputWord: IWord = { value: 'apple', _id: '1' } as IWord;
            const targetWord: IWord = { value: 'apple', _id: '2' } as IWord;

            jest.spyOn(service, 'checkSimilarity').mockReturnValue(Promise.resolve(inputWord.value.length - targetWord.value.length));

            const result = await service.checkSimilarity(inputWord, targetWord);

            expect(result).toBe(inputWord.value.length - targetWord.value.length);
        });
        it('should calculate similarity between word and empty string', async () => {
            const inputWord: IWord = { value: 'apple', _id: '1' } as IWord;
            const targetWord: IWord = { value: '', _id: '2' } as IWord;
            jest.spyOn(service, 'checkSimilarity').mockReturnValue(Promise.resolve(inputWord.value.length - targetWord.value.length));

            const result = await service.checkSimilarity(inputWord, targetWord);

            expect(result).toBe(inputWord.value.length - targetWord.value.length);
        });

    });
    describe('isSimilarEnough', () => {
        it('should return true if words are similar enough', async () => {
            const inputWord: IWord = { value: 'apple', _id: '1' } as IWord;
            const targetWord: IWord = { value: 'applle', _id: '2' } as IWord;
            const threshold = 70;

            jest.spyOn(service, 'isSimilarEnough').mockReturnValue(Promise.resolve(true));

            const result = await service.isSimilarEnough(inputWord, targetWord, threshold);

            expect(result).toBe(true);
        });

        it('should return false if words are not similar enough', async () => {
            const inputWord: IWord = { value: 'apple', _id: '1' } as IWord;
            const targetWord: IWord = { value: 'applle', _id: '2' } as IWord;
            const threshold = 90;

            jest.spyOn(service, 'isSimilarEnough').mockReturnValue(Promise.resolve(false));
            const result = await service.isSimilarEnough(inputWord, targetWord, threshold);

            expect(result).toBe(false);
        });
    });
    describe('checkSentenceForWord', () => {
        it('should return true if word is found in sentence', async () => {
            const word: IWord = { value: 'apple', _id: '1' } as IWord;
            const sentence = 'I ate an apple';

            jest.spyOn(service, 'checkSentenceForWord').mockReturnValue(Promise.resolve(true));

            const result = await service.checkSentenceForWord(word, sentence);

            expect(result).toBe(true);
        });
        it('should return false if word is not found in sentence', async () => {
            const word: IWord = { value: 'apple', _id: '1' } as IWord;
            const sentence = 'I ate a banana';

            jest.spyOn(service, 'checkSentenceForWord').mockReturnValue(Promise.resolve(false));

            const result = await service.checkSentenceForWord(word, sentence);

            expect(result).toBe(false);
        });
    });
});
