import { customAlphabet } from 'nanoid/async';

export async function getRandomGreenieId() {
  return `GRN${await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 5)()}`;
}
