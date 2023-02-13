import express, { Express } from 'express';
import { PeepServer } from './setupServer';
import dbConnection from './setupDatabase';
import { config } from './config';

class PeepApplication {
  public initialize(): void {
    this.loadConfig(); // load the configuration first!
    dbConnection(); // connect to the database after validation!
    const app: Express = express();
    const server: PeepServer = new PeepServer(app);
    server.start();
  }

  private loadConfig(): void {
    // load the configuration
    config.validateConfig();
  }
}

const application: PeepApplication = new PeepApplication();

application.initialize();
