import mongoose from "mongoose";

export default async () => {
  const connect = () => {
    mongoose
      .connect("mongodb://127.0.0.1:27017/peep-app-backend")
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
