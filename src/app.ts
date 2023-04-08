import { dbConnection } from '@database';
import { bootstrap } from '@fastify-resty/core';
import middie from '@fastify/middie';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fastify from 'fastify';
import helmet from 'helmet';
import hpp from 'hpp';
import { connect, set } from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import 'reflect-metadata';
import { env } from './config';

export class App {
  public app: ReturnType<typeof fastify>;
  public env: string;
  public port: number;

  constructor() {
    this.env = env('APP_ENV', 'development');
    this.port = env('PORT', 8080);
  }

  public async listen() {
    this.app = fastify();

    await this.connectToDatabase();
    await this.initializeMiddlewares();
    this.initializeErrorHandling();

    await this.app.listen({
      port: this.port,
    });

    logger.info(`=================================`);
    logger.info(`======= ENV: ${this.env} =======`);
    logger.info(`🚀 App listening on the port ${this.port}`);
    logger.info(`=================================`);
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    set('strictQuery', true);

    return connect(dbConnection);
  }

  private async initializeMiddlewares() {
    this.app = await this.app.register(middie);

    this.app.register(bootstrap, {
      entry: path.resolve(__dirname, 'controllers'),
    });

    this.app.use(morgan(env('LOG_FORMAT'), { stream }));
    this.app.use(cors({ origin: env('ORIGIN'), credentials: env('CREDENTIALS') }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.setErrorHandler(ErrorMiddleware);
  }
}

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);
