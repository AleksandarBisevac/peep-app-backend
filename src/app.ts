import express, { Express } from 'express';
import { PeepServer } from '@root/setupServer';
import dbConnection from '@root/setupDatabase';
import { config } from '@root/config';

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
    config.cloudinaryConfig();
  }
}

const application: PeepApplication = new PeepApplication();

application.initialize();
