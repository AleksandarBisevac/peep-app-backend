import express, { Express } from "express";
import { PeepServer } from "./setupServer";
import dbConnection from "./setupDatabase";

class PeepApplication {
  public initialize(): void {
    dbConnection(); // connect to the database first!
    const app: Express = express();
    const server: PeepServer = new PeepServer(app);
    server.start();
  }
}

const application: PeepApplication = new PeepApplication();

application.initialize();
