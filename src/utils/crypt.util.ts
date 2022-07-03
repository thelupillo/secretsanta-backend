import Bcrypt from 'bcrypt';

const saltRounds: number = 10;

export const genHash = async (plainText: string): Promise<string> => {
  return await Bcrypt.hash(plainText, saltRounds);
};

export const compareHash = async (plainText: string, hash: string): Promise<boolean> => {
  return await Bcrypt.compare(plainText, hash);
};