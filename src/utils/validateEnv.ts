import { cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      default: 'development',
    }),
    PORT: port({
      default: 3000,
    }),
  });
};
