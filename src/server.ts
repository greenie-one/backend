import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

// const controllers = [RootController, AuthController, ProfileController, EducationHistoryController];
const controllers = [];

const app = new App(controllers);

app.listen();

process.on('uncaughtException', () => console.error);
process.on('unhandledRejection', console.error);
