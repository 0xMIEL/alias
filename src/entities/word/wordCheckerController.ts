import { NextFunction, Request, Response } from 'express';
import { WordCheckerService } from './wordCheckerService';
import { HTTP_STATUS_CODE } from '../../constants/constants';

export class WordCheckerController {

  constructor(private wordCheckerService: WordCheckerService) {
    this.wordCheckerService = wordCheckerService;
  }

  async getWord(req: Request, res: Response, next: NextFunction) {
    const { difficulty } = req.body;
    const word = await this.wordCheckerService.getRandomWord(difficulty);

    res.status(HTTP_STATUS_CODE.SUCCESS_200).json({
      data: word,
      status: 'success',
    });
  }

  async getAllWords(req: Request, res: Response, next: NextFunction) {
    const words = await this.wordCheckerService.getAllWords();

    res.status(HTTP_STATUS_CODE.SUCCESS_200).json({
      data: words,
      status: 'success',
    });
  }

  async addWord(req: Request, res: Response, next: NextFunction) {
    const word = req.body;
    const newWord = await this.wordCheckerService.addWord(word);

    res.status(HTTP_STATUS_CODE.SUCCESS_200).json({
      data: newWord,
      status: 'success',
    });
  }

  async addWords(req: Request, res: Response, next: NextFunction) {
    const words = req.body;
    const newWords = await this.wordCheckerService.addWords(words);

    res.status(HTTP_STATUS_CODE.SUCCESS_200).json({
      data: newWords,
      status: 'success',
    });
  }

  async deleteWord(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    await this.wordCheckerService.deleteWordById(id);

    res.status(HTTP_STATUS_CODE.SUCCESS_200).json({
      status: 'success',
    });
  }

  async updateWord(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const updateData = req.body;
    const updatedWord = await this.wordCheckerService.updateWordById(id, updateData);

    res.status(HTTP_STATUS_CODE.SUCCESS_200).json({
      data: updatedWord,
      status: 'success',
    });
  }

  async getSimilarity(req: Request, res: Response, next: NextFunction) {
    const { inputWord, targetWord } = req.body;
    const similarity = await this.wordCheckerService.checkSimilarity(inputWord, targetWord);

    res.status(HTTP_STATUS_CODE.SUCCESS_200).json({
      data: similarity,
      status: 'success',
    });
  }

  async checkForWord(req: Request, res: Response, next: NextFunction) {
    const { word, sentence } = req.body;
    const isWordInSentence = await this.wordCheckerService.checkSentenceForWord(word, sentence);

    res.status(HTTP_STATUS_CODE.SUCCESS_200).json({
      data: isWordInSentence,
      status: 'success',
    });
  }
}