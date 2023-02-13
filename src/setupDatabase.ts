import Logger from "bunyan";
import mongoose from "mongoose";
import { config } from "./config";

const log: Logger = config.createLogger("setup-database");

export default async () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL as string)
      .then(() => {
        log.info("Successfully connected to MongoDB.");
      })
      .catch((error) => {
        log.error("Error connecting to MongoDB: ", error);
        return process.exit(1); // exit the process with an error code
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect); // if the connection to MongoDB is lost, try to reconnect
};
