import 'reflect-metadata';
import './utils/logger';

import { dbConnection } from '@database';
import middie from '@fastify/middie';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fastify from 'fastify';
import helmet from 'helmet';
import hpp from 'hpp';
import { connect, set } from 'mongoose';
import { env } from './config';
import { registerControllers } from './controllers';

export class App {
  public app: ReturnType<typeof fastify>;
  public env: string;
  public port: number;

  constructor() {
    this.env = env('APP_ENV', 'development');
    this.port = env('PORT', 8080);
  }

  public async listen() {
    this.app = fastify({
      logger: false,
    });

    await this.connectToDatabase();
    await this.initializeMiddlewares();
    this.initializeErrorHandling();
    registerControllers(this.app);

    await this.app.listen({
      host: '0.0.0.0',
      port: this.port,
    });

    console.info('');
    console.info(`==============================`);
    console.info(`====== ENV: ${this.env} ======`);
    console.info(`App listening on the port ${this.port}`);
    console.info(`==============================`);
    console.info('');
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    set('strictQuery', true);
    return connect(dbConnection);
  }

  private async initializeMiddlewares() {
    this.app = await this.app.register(middie);

    this.app.use(cors({ origin: env('ORIGIN'), credentials: env('CREDENTIALS') }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cookieParser());

    this.app.addHook('onRequest', async (req) => {
      console.debug(`Got request: [${req.method}] ${req.url}`);
    });

    this.app.addHook('onResponse', async (req, reply) => {
      console.debug(`Request: [${req.method}] ${req.url} - ${reply.getResponseTime().toFixed(5)}ms`);
    });
  }

  private initializeErrorHandling() {
    this.app.setErrorHandler(ErrorMiddleware);
  }
}
