import '@/utils/mongoose';

import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import DocumentController from './controllers/document.controller';
import IDsController from './controllers/ids.controller';
import LocationController from './controllers/location.controller';
import ProfileController from './controllers/profile.controller';
import ReportController from './controllers/report.controller';
import ResidentialInfoController from './controllers/residentialInfo.controller';
import ResidentialPeerController from './controllers/residentialPeer.controller';
import RootController from './controllers/root.controller';
import SkillController from './controllers/skills.controller';
import UserController from './controllers/user.controller';
import WaitlistController from './controllers/waitlist.controller';
import WorkExPeerController from './controllers/workExPeer.controller';
import WorkExperienceController from './controllers/workExperience.controller';
import GoogleSheetsController from './controllers/googleSheets.controller';

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
  DocumentController,
  RootController,
  ProfileController,
  WaitlistController,
  WorkExperienceController,
  SkillController,
  ResidentialInfoController,
  IDsController,
  UserController,
  LocationController,
  WorkExPeerController,
  ResidentialPeerController,
  GoogleSheetsController,
  ReportController,
];

const app = new App(controllers);
app.listen();
