import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export function env<T>(key: string, defaultValue?: T): T {
  const keys = Object.keys(process.env);
  const value = process.env[keys.find((val) => val.toLowerCase() === key.toLowerCase())];
  if (!defaultValue && !value) {
    throw new Error(`env ${key} not defined`);
  }
  return (value as T) ?? defaultValue;
}
