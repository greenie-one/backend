import { env } from '@/config';

const user = encodeURIComponent(env('DB_USER'));
const password = encodeURIComponent(env('DB_PASSWORD'));
const host = env('DB_HOST');
const port = env('DB_PORT');
const database = env('DB_DATABASE');

export const dbConnection = `mongodb://${user}:${password}@${host}:${port}/${database}?authMechanism=DEFAULT&authSource=admin`;
