import { IWord } from '../../entities/word/types/word';
import { WordCheckerService } from '../../entities/word/wordCheckerService';

export async function isCheatinExplanation(
  wordCheckerService: WordCheckerService,
  wordToCheck: string,
  explanation: string,
) {
  const word = toIWord(wordToCheck);
  const sentence = explanation;
  const cheatingResponse = await wordCheckerService.checkSentenceForWord(
    word,
    sentence,
  );
  return cheatingResponse;
}

export async function isTheSame(
  wordCheckerService: WordCheckerService,
  word: string,
  guess: string,
) {
  const inputWord = toIWord(guess);
  const targetWord = toIWord(word);

  const similarityResponse = await wordCheckerService.checkSimilarity(
    inputWord,
    targetWord,
  );

  return similarityResponse;
}

function toIWord(word: string): IWord {
  return { value: word } as IWord;
}

function fromIWord(word: IWord): string {
  return word.value;
}

export async function getRandomWord(wordCheckerService: WordCheckerService) {
  const generatedWord = await wordCheckerService.getRandomWord();
  return fromIWord(generatedWord);
}
