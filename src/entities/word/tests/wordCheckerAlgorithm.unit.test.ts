/* eslint-disable no-magic-numbers */
import { levenshtein } from '../helpers/wordCheckerHelpers';
describe('levenshtein', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return 0 for identical strings', async () => {
    const stringA: string = 'test';
    const stringB: string = 'test';
    const distance = await levenshtein(stringA, stringB);
    expect(distance).toBe(0);
  });

  it('should return the length of the other string when one is empty', async () => {
    const distance1 = await levenshtein('test', '');
    expect(distance1).toBe(4);

    const distance2 = await levenshtein('', 'test');
    expect(distance2).toBe(4);
  });

  it('should return the correct distance for similar strings', async () => {
    const distance = await levenshtein('test', 'tent');
    expect(distance).toBe(1);
  });

  it('should return the correct distance for completely different strings', async () => {
    const distance = await levenshtein('test', 'hello');
    expect(distance).toBe(4);
  });
});
