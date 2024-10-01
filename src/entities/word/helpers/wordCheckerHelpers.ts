const PERCENTAGE_FACTOR = 100;

import { IWord } from '../Word';

// Levenshtein distance algorithm - finds the minimum number of operations needed to transform one word into another
export async function levenshtein(s1: string, s2: string): Promise<number> {
    if (!s1 || !s2) throw new Error("Both strings must be provided!");
    
    // ESLINT: no-magic-numbers - it's shouting at me for using 0 as a magic number, this is solution to that
    const zero = 0;
    // Or set rules for ESLINT to ignore this line or numbers like [0,1,-1] etc.

    const distanceMatrix: number[][] = Array(s1.length + 1)
      .fill(null)
      .map(() => Array(s2.length + 1).fill(zero));

    for (let i = 0; i <= s1.length; i++) {
      for (let j = 0; j <= s2.length; j++) {
        if (i === zero) {
          distanceMatrix[i][j] = j; // if first word is empty
        } else if (j === zero) {
          distanceMatrix[i][j] = i; // if second word is empty
        } else if (s1[i - 1] === s2[j - 1]) {
          distanceMatrix[i][j] = distanceMatrix[i - 1][j - 1]; // if the letters are the same
        } else {
          distanceMatrix[i][j] = Math.min(
            distanceMatrix[i - 1][j - 1] + 1, // Swap
            distanceMatrix[i][j - 1] + 1,     // Insert
            distanceMatrix[i - 1][j] + 1      // Delete
          );
        }
      }
    }
    return distanceMatrix[s1.length][s2.length];
}

export const calculateLevenshteinSimilarity = async (inputWord: string, targetWord: string): Promise<number> => {
  const distance = await levenshtein(inputWord, targetWord);
  const maxLength = Math.max(inputWord.length, targetWord.length);
  return (1 - distance / maxLength) * PERCENTAGE_FACTOR;
};

export const getRandomElement = (words: IWord[], usedWords: Set<string>): IWord | null => {
  const filteredWords = words.filter(word => !usedWords.has(word.value));

  if (filteredWords.length === 0) {
      return null; // Brak dostępnych słów
  }

  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  return filteredWords[randomIndex];
};


