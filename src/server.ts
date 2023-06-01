import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import DocumentsController from './controllers/documents.controller';
import { OAuthController } from './controllers/oauth.controller';
import ProfileController from './controllers/profile.controller';
import ResidentialInfoController from './controllers/residentialInfo.controller';
import RootController from './controllers/root.controller';
import SkillController from './controllers/skills.controller';
import WaitlistController from './controllers/waitlist.controller';
import WorkExperienceController from './controllers/workExperience.controller';

process.on('uncaughtException', (e) => {
  console.error(e);
  process.exit(-1);
});

process.on('unhandledRejection', (e) => {
  console.error(e);
  process.exit(-1);
});

ValidateEnv();

const controllers = [
  RootController,
  OAuthController,
  ProfileController,
  WaitlistController,
  WorkExperienceController,
  SkillController,
  ResidentialInfoController,
  DocumentsController,
];

const app = new App(controllers);

app.listen();
