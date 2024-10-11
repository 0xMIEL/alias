const PERCENTAGE_FACTOR = 100;

import { IWord } from '../types/word';

// Levenshtein distance algorithm - finds the minimum number of operations needed to transform one word into another
export async function levenshtein(a: string | undefined, b: string | undefined): Promise<number> {
  if (a === undefined || b === undefined) {
    throw new Error("Both strings must be provided!");
  }
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new Error("Both inputs must be strings!");
  }

  if (a.length === 0) return b.length; 
  if (b.length === 0) return a.length; 

  const lenA = a.length;
  const lenB = b.length;

  const matrix: number[][] = Array.from({ length: lenB + 1 }, () => Array(lenA + 1).fill(0));

  for (let j = 0; j <= lenA; j++) {
    matrix[0][j] = j; 
  }

  for (let i = 0; i <= lenB; i++) {
    matrix[i][0] = i; 
  }

  for (let i = 1; i <= lenB; i++) {
    for (let j = 1; j <= lenA; j++) {
      const cost = a.charAt(j - 1) === b.charAt(i - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,    // deletion
        matrix[i][j - 1] + 1,    // insertion
        matrix[i - 1][j - 1] + cost // swap
      );
    }
  }

  return matrix[lenB][lenA];
}

export const calculateLevenshteinSimilarity = async (inputWord: string, targetWord: string): Promise<number> => {
  const distance = await levenshtein(inputWord, targetWord);
  const maxLength = Math.max(inputWord.length, targetWord.length);
  return (1 - distance / maxLength) * PERCENTAGE_FACTOR;
};

export const getRandomElement = (words: IWord[], usedWords: Set<string>): IWord | null => {
  const filteredWords = words.filter(word => !usedWords.has(word.value));

  if (filteredWords.length === 0) {
      return null;
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
};


