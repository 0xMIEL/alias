import { NextFunction, Request, Response } from 'express';
import { WordCheckerService } from './wordCheckerService';
import { HTTP_STATUS_CODES } from '../../constants/httpStatusCodes';

export class WordCheckerController {
  constructor(private wordCheckerService: WordCheckerService) {
    this.wordCheckerService = wordCheckerService;
  }

  async getWord(req: Request, res: Response, next: NextFunction){
    const word = await this.wordCheckerService.getRandomWord();

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: word,
      status: 'success',
    });
  }

  async getSimilarity(req: Request, res: Response, next: NextFunction) {
    const { inputWord, targetWord } = req.body;

    const similarity = await this.wordCheckerService.checkSimilarity(inputWord, targetWord);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: similarity,
      status: 'success',
    });
  }

  async checkForWord(req: Request, res: Response, next: NextFunction) {
    const { word, sentence } = req.body;

    const isWordInSentence = await this.wordCheckerService.checkSentenceForWord(word, sentence);

    res.status(HTTP_STATUS_CODES.SUCCESS_200).json({
      data: isWordInSentence,
      status: 'success',
    });
  }
}
