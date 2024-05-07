import { genSalt, compare, hash } from "bcrypt";

export async function hashPassword(password: string) {
  const salt = await genSalt(10);
  return await hash(password, salt);
}

export async function checkPassword(password: string, hashedPassword: string) {
  const comparePw = await compare(password, hashedPassword);
  return comparePw;
}
