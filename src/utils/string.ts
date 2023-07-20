import { customAlphabet } from 'nanoid/async';

export function generateOTP(length = 6) {
  return Math.random().toFixed(length).slice(-length);
}

export async function getRandomGreenieId() {
  return `GRN${await customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 5)()}`
}