import { env } from '@/config';

const user = encodeURIComponent(env('DB_USER'));
const password = encodeURIComponent(env('DB_PASSWORD'));
const host = env('DB_HOST');
const database = env('DB_DATABASE');

export const dbConnection =
  (env('APP_ENV') === 'local'
    ? `mongodb://${user}:${password}@${host}:27017/${database}?authMechanism=DEFAULT&tls=false&directConnection=true&authSource=${database}`
    : `mongodb+srv://${user}:${password}@${host}/${database}?replicaSet=rs0&tls=false&authMechanism=DEFAULT&authSource=${database}`) + ``;
