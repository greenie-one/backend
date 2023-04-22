import { config } from 'dotenv';
config({ path: `.env.${process.env.APP_ENV || 'local'}` });

export function env<T = string>(key: string, defaultValue?: T): T {
  const keys = Object.keys(process.env);
  const value = process.env[keys.find((val) => val.toLowerCase() === key.toLowerCase())];
  if (typeof defaultValue === 'undefined' && typeof value === 'undefined') {
    throw new Error(`env ${key} not defined`);
  }
  return (value as T) ?? defaultValue;
}
