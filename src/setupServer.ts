import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";

import { config } from "./config";

const SERVER_PORT = config.PORT;

export class PeepServer {
  // app is a private property of the class and represents the express app instance
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  // securityMiddleware is a private method that adds security middleware to the express app
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
        secure: config.NODE_ENV !== "development", // set to true if your using https (recommended) and set the domain to your domain name (not localhost)
      })
    );

    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true, // allow cookies to be sent to and from the server (required for cookie-session)
        optionsSuccessStatus: HTTP_STATUS.OK,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }

  // standardMiddleware is a private method that adds standard middleware to the express app
  private standardMiddleware(app: Application): void {
    app.use(compression()); // compression is used to compress responses (e.g. gzip) to reduce the size of the response body and increase the speed of a web app
    app.use(json({ limit: "50mb" })); // json is used to parse json data (e.g. from fetch requests) and limit is used to limit the size of the data
    app.use(urlencoded({ limit: "50mb", extended: true })); // urlencoded is used to parse url encoded data (e.g. from forms) and limit is used to limit the size of the data and extended is used to allow for rich objects and arrays to be encoded into the url encoded format
  }

  // routesMiddleware is a private method that adds routes middleware to the express app
  private routesMiddleware(app: Application): void {}

  // globalErrorHandler is a private method that adds a global error handler to the express app
  private globalErrorHandler(app: Application): void {}

  // startServer is a private method that starts the express app
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app); // create a new http server instance
      this.startHttpServer(httpServer);
    } catch (error) {
      console.log(error);
    }
  }

  // createSocketIO is a private method that creates a socket.io instance
  private createSocketIO(httpServer: http.Server): void {}

  // startHttpServer is a private method that starts the http server, and it will be called inside the startServer method
  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`); // login library can be used to log messages to the console, don't use console.log in production
    });
  }
}
