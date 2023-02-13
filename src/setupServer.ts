import {
  CustomError,
  IErrorResponse,
} from "./shared/globals/helpers/errorHandler";
import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
  request,
} from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieSession from "cookie-session";
import HTTP_STATUS from "http-status-codes";
// socket io and redis are used to create a real time connection between the server and the client
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
// logger is used to log messages to the console
import Logger from "bunyan";
// express-async-errors is used to handle async errors in express
import "express-async-errors";

import { config } from "./config";
import appRoutes from "./routes";

const SERVER_PORT = config.PORT;
const log: Logger = config.createLogger("server");

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
  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  // globalErrorHandler is a private method that adds a global error handler to the express app
  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({
        status: "error",
        message: `Can't find ${req.originalUrl} on this server!`,
      });
    });

    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        log.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      }
    );
  }

  // startServer is a private method that starts the express app
  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app); // create a new http server instance
      const socketIO: Server = await this.createSocketIO(httpServer); // create a new socket.io instance
      this.startHttpServer(httpServer); // start the http server
      this.socketIOConnections(socketIO); // define methods for socket.io to use (e.g. on connection, on disconnect)
    } catch (error) {
      log.error(error);
    }
  }

  // createSocketIO is a private method that creates a socket.io instance
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: config.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        // credentials: true,
      },
    });
    // create a redis client and a subscriber client
    const publicClient = createClient({ url: config.REDIS_HOST });
    const subClient = publicClient.duplicate();

    // connect to the redis server and create the adapter for socket.io to use redis as the pub/sub server
    await Promise.all([publicClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(publicClient, subClient));
    return io;
  }

  // define methods for socket.io to use
  private socketIOConnections(io: Server): void {
    // io.on("connection", (socket) => {
    //   console.log("a user connected");
    //   socket.on("disconnect", () => {
    //     console.log("user disconnected");
    //   });
    // });
  }

  // startHttpServer is a private method that starts the http server, and it will be called inside the startServer method
  private startHttpServer(httpServer: http.Server): void {
    log.info(`Server has started with process id: ${process.pid}`);

    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`); // login library can be used to log messages to the console, don't use console.log in production
    });
  }
}
