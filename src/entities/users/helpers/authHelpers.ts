import bcrypt from 'bcryptjs';

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
};

export const comparePasswords = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const match = await bcrypt.compare(password, hash);
  return match;
};
