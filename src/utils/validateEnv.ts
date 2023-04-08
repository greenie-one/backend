import { cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    APP_ENV: str({
      default: 'development',
    }),
    PORT: port({
      default: 3000,
    }),
  });
};
