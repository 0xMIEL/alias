import { Router } from 'express';
import { WordCheckerController } from './wordCheckerController';
import { WordCheckerService } from './wordCheckerService';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';

export const wordCheckRouter = Router();
const wordService = new WordCheckerService();
const wordCheckerController = new WordCheckerController(wordService);

/**
 * @swagger
 * /api/v1/word/randomWord:
 *   post:
 *     summary: Get a random word based on the difficulty level from the Words collection in the database
 *     tags: [Word]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               difficulty:
 *                 type: string
 *                 description: The difficulty level for the random word (e.g., easy, medium, hard)
 *     responses:
 *       200:
 *         description: A random word
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the word
 *                     value:
 *                       type: string
 *                       description: The random word retrieved from the database
 *                 status:
 *                   type: string
 *                   description: The status of the request
 *       404:
 *         description: No words found for the specified difficulty level
 */
wordCheckRouter
    .route('/randomWord')
    .post(asyncErrorCatch(wordCheckerController.getWord.bind(wordCheckerController)));

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
 *                   type: number
 *                 status:
 *                   type: string
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

/**
 * @swagger
 * /api/v1/word/words:
 *   post:
 *     summary: Add new words
 *     description: Add multiple new words to the database.
 *     tags: [Words]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                   description: The word's value.
 *                 category:
 *                   type: string
 *                   description: The word's category.
 *                 difficulty:
 *                   type: string
 *                   description: The difficulty level of the word (easy, medium, hard).
 *               example:
 *                 - value: "exampleWord1"
 *                   category: "exampleCategory"
 *                   difficulty: "easy"
 *                 - value: "exampleWord2"
 *                   category: "exampleCategory"
 *                   difficulty: "medium"
 *     responses:
 *       201:
 *         description: Words successfully added.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Server error.
 *   get:
 *     summary: Get all words
 *     description: Retrieve all words from the database.
 *     tags: [Words]
 *     responses:
 *       200:
 *         description: Successfully retrieved all words.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The word's unique ID.
 *                       category:
 *                         type: string
 *                         description: The word's category.
 *                       value:
 *                         type: string
 *                         description: The word's value.
 *                       difficulty:
 *                         type: string
 *                         description: The difficulty level of the word (easy, medium, hard).
 *                       __v:
 *                         type: integer
 *                         description: Version key for the document.
 *               example:
 *                 data: [
 *                   {
 *                     "_id": "603cfb8b67e5a2d90b33487b",
 *                     "category": "exampleCategory",
 *                     "difficulty": "easy",
 *                     "value": "exampleWord1",
 *                     "__v": 0
 *                   },
 *                   {
 *                     "_id": "603cfb8b67e5a2d90b33487c",
 *                     "category": "exampleCategory",
 *                     "difficulty": "medium",
 *                     "value": "exampleWord2",
 *                     "__v": 0
 *                   }
 *                 ]
 *       500:
 *         description: Server error.
 */
wordCheckRouter
    .route('/words')
    .get(asyncErrorCatch(wordCheckerController.getAllWords.bind(wordCheckerController)))
    .post(asyncErrorCatch(wordCheckerController.addWords.bind(wordCheckerController)));

/**
 * @swagger
 * /api/v1/word/word:
 *   post:
 *     summary: Add a new word
 *     description: Add a single new word to the database.
 *     tags: [Words]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *                 description: The word's value.
 *               category:
 *                 type: string
 *                 description: The word's category.
 *               difficulty:
 *                 type: string
 *                 description: The difficulty level of the word (easy, medium, hard).
 *             example:
 *               value: "test"
 *               category: "test"
 *               difficulty: "easy"
 *     responses:
 *       201:
 *         description: Word successfully added.
 *       400:
 *         description: Invalid input data.
 *       500:
 *         description: Server error.
 */
wordCheckRouter
    .route('/word')
    .post(asyncErrorCatch(wordCheckerController.addWord.bind(wordCheckerController)));

/**
 * @swagger
 * /api/v1/word/word/{id}:
 *   delete:
 *     summary: Delete a word
 *     description: Delete a single word from the database based on its ID.
 *     tags: [Words]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The word's unique ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Word successfully deleted.
 *       404:
 *         description: Word not found.
 *       500:
 *         description: Server error.
 *   patch:
 *     summary: Update a word
 *     description: Update the category and/or difficulty of a word based on its ID.
 *     tags: [Words]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The word's unique ID.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: The new category of the word.
 *               difficulty:
 *                 type: string
 *                 description: The new difficulty level of the word (easy, medium, hard).
 *     responses:
 *       200:
 *         description: Word successfully updated.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: Word not found.
 *       500:
 *         description: Server error.
 */
wordCheckRouter
    .route('/word/:id')
    .delete(asyncErrorCatch(wordCheckerController.deleteWord.bind(wordCheckerController)))
    .patch(asyncErrorCatch(wordCheckerController.updateWord.bind(wordCheckerController)));