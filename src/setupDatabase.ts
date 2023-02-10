import mongoose from "mongoose";
import { config } from "./config";
export default async () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL as string)
      .then(() => {
        console.log("Successfully connected to MongoDB.");
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB: ", error);
        return process.exit(1); // exit the process with an error code
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect); // if the connection to MongoDB is lost, try to reconnect
};
