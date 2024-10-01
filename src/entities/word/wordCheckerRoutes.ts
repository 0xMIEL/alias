import { Router } from 'express';
import {WordCheckerController} from './wordCheckerController';
import { Word} from './Word';
import { WordCheckerService } from './wordCheckerService';

// Changed Promise<unknown> to Promise<void> in it to fix errors!
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';

export const wordCheckRouter = Router();

const wordService = new WordCheckerService(Word);
const wordCheckerController = new WordCheckerController(wordService);

wordCheckRouter
    .route('/randomWord')
    .get(asyncErrorCatch(wordCheckerController.getWord.bind(wordCheckerController)))
    
wordCheckRouter
    .route('/similarity')
    .post(asyncErrorCatch(wordCheckerController.getSimilarity.bind(wordCheckerController)));

wordCheckRouter
    .route('/sentenceCheat')
    .post(asyncErrorCatch(wordCheckerController.checkForWord.bind(wordCheckerController)));