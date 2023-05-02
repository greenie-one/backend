// import { env } from '@/config';

// const user = encodeURIComponent(env('DB_USER'));
// const password = encodeURIComponent(env('DB_PASSWORD'));
// const host = env('DB_HOST');
// const database = env('DB_DATABASE');

export const dbConnection = `mongodb://root:example@localhost:27017/?authMechanism=DEFAULT&tls=false`;
console.log(dbConnection);
