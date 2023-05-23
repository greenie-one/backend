import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { AuthController } from './controllers/auth.controller';
import { OAuthController } from './controllers/oauth.controller';
import ProfileController from './controllers/profile.controller';
import RootController from './controllers/root.controller';
import WaitlistController from './controllers/waitlist.controller';
import workExperienceController from './controllers/workExperience.controller';

process.on('uncaughtException', (e) => {
  console.error(e);
  process.exit(-1);
});

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(-1);
});

ValidateEnv();

const controllers = [RootController, AuthController, OAuthController, ProfileController, WaitlistController, workExperienceController];

const app = new App(controllers);

app.listen();
