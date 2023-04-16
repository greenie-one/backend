import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { AuthController } from './controllers/auth.controller';
import EducationHistoryController from './controllers/education.controller';
import ProfileController from './controllers/profile.controller';
import RootController from './controllers/root.controller';
import UserController from './controllers/users.controller';

ValidateEnv();

const controllers = [RootController, AuthController, UserController, ProfileController, EducationHistoryController];

const app = new App(controllers);

app.listen();

process.on('uncaughtException', () => console.error);
process.on('unhandledRejection', console.error);
