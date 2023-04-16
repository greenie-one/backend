import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { AuthController } from './controllers/auth.controller';
import RootController from './controllers/root.controller';
import UserController from './controllers/users.controller';

console.log(process.env);

ValidateEnv();

const controllers = [RootController, AuthController, UserController];

const app = new App(controllers);

app.listen();

process.on('uncaughtException', () => console.error);
process.on('unhandledRejection', console.error);
