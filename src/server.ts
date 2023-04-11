import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import RootController from './controllers/root.controller';
import UserController from './controllers/users.controller';

ValidateEnv();

const controllers = [RootController, UserController];

const app = new App(controllers);

app.listen();

process.on('uncaughtException', () => console.error);
process.on('unhandledRejection', console.error);
