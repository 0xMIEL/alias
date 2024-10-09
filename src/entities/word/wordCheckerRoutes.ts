import { Router } from 'express';
import {WordCheckerController} from './wordCheckerController';
import { WordCheckerService } from './wordCheckerService';

// Changed Promise<unknown> to Promise<void> in it to fix errors!
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';

export const wordCheckRouter = Router();

const wordService = new WordCheckerService();
const wordCheckerController = new WordCheckerController(wordService);

/**
 * @swagger
 * /api/v1/word/randomWord:
 *   get:
 *     summary: Get a random word from Words collection in DB
 *     tags: [Word]
 *     responses:
 *       200:
 *         description: A random word
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                  type: object
 *                  properties:
 *                   _id:
 *                      type: string
 *                  value:
 *                     type: string
 *                 status:
 *                  type: string
 *       404:
 *         description: No words found
 */
wordCheckRouter
    .route('/randomWord')
    .get(asyncErrorCatch(wordCheckerController.getWord.bind(wordCheckerController)))
/**
 * @swagger
 * /api/v1/word/similarity:
 *   post:
 *     summary: Check similarity between two words
 *     tags: [Word]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inputWord:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *               targetWord:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *     responses:
 *       200:
 *         description: Similarity score between two words, returns percentage of similarity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                  type: number
 *                 status:
 *                  type: string
 *       400:
 *         description: Bad request
 */
wordCheckRouter
    .route('/similarity')
    .post(asyncErrorCatch(wordCheckerController.getSimilarity.bind(wordCheckerController)));
/**
 * @swagger
 * /api/v1/word/sentenceCheat:
 *   post:
 *     summary: Check if a word exists in a sentence
 *     tags: [Word]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sentence:
 *                 type: string
 *               word:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: string
 *     responses:
 *       200:
 *         description: Word found in the sentence if true, false otherwise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: boolean
 *                 status:
 *                   type: string
 *       400:
 *         description: Bad request
 */
wordCheckRouter
    .route('/sentenceCheat')
    .post(asyncErrorCatch(wordCheckerController.checkForWord.bind(wordCheckerController)));