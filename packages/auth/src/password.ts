import bcrypt from "bcrypt";

const DEFAULT_SALT_ROUNDS = 10;

export async function hashPassword(password: string, saltRounds = DEFAULT_SALT_ROUNDS): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const Password = {
  hash: hashPassword,
  compare: comparePassword,
};

export default Password;
