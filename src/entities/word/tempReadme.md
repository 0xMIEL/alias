# Word Checker Module

The Word Checker module is designed for managing words for the game. It allows retrievieng random word from the list, and also checks for similarities or potential cheating in chat message.

## Components:
- Model: `Word.ts`,
- Service: `wordCheckerService.ts`
- Controller: `wordCheckerController.ts`,
- Routes: `wordCheckerRoutes.ts`,
- Helper functions: `wordCheckerHelpers.ts`

## 1. Model

`Word` model represents structure of the word documents stored in MongoDB.

Properties:
- `value`: string


## 2. Service

`wordCheckerService` class handles operations such as fetching words from db, checking similarity between words, and validating sentences for potential cheating using Levenshtein algorithm.

Methods:
- `getAllWords()`: Retrieves all words from database,
- `getRandomWord()`: Fetches a random word from database, also ensures it wasn't used previously,
- `checkSimilarity(inputWord: string, targetWord: string)`: Calculates the Levenshtein distance (similarity) between two words,
- `isSimilarEnough(inputWord: string, targetWord:string, threshold: number)`: Checks if similarity percentage exceeds threshold,
- `checkSentenceForWord(word: IWord, sentence: string)`: Checks if selected word is in sentence, and returns True if it is.

## 3. Controller

`wordController` class handles incoming requests related to words, utilizing the `wordCheckerService` to perform necessary operations.

Methods:
`getWord(req, res, next)`: Handles the request to fetch a random word.
`getSimilarity(req, res, next)`: Handles the request to check similarity between words.
`checkForWord(req, res, next)`: Handles the request to validate a sentence for potential cheating against a random word.

## 4. Routes

The routes for word-related operations are defined here, linking them to the corresponding controller methods.

`GET /randomWord`: Fetches a random word.
`POST /similarity`: Checks similarity between two words.
`POST /sentenceCheat`: Validates a sentence for potential cheating.

## 5. Helpers

Helpers file provides utility functions for the Word Checker module, including random word selection and similarity checking using Levenshtein algorithm.

### Levenshtein algorithm

The Levenshtein algorithm is a string metric that quantifies the difference between two sequences by calculating the minimum number of single-character edits required to change one string into the other. The allowed operations include insertion, deletion and substitution.

How It Works

The algorithm uses dynamic programming to build a matrix where each cell represents the cost of transforming a substring of the first string into a substring of the second string. The matrix is filled based on the following rules:

- The first row and first column represent the cost of converting an empty string to the respective substrings.
- For each character comparison, if the characters are the same, the cost remains the same as the diagonal cell; if not, it considers the costs of insertion, deletion, and substitution, taking the minimum value.

The final cell in the matrix contains the Levenshtein distance, indicating the minimum number of edits required to convert one string into another.