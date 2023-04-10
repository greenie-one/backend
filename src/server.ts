import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App();

app.listen();

process.on('uncaughtException', () => console.error);
process.on('unhandledRejection', console.error);
