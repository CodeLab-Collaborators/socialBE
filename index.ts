import express, { Application } from "express";
import { mainApp } from "./mainApp";
import dotenv from "dotenv";
import "reflect-metadata";

import { db } from "./utils/dataBase";
dotenv.config();

const port: number = parseInt(process.env.APP_PORT!);
const app: Application = express();

mainApp(app);

const server = app.listen(port, () => {
  console.log("");
  console.log("server is ready to connect 🚀🚁🚀🚀");
  db();
});

process.on("uncaughtException", (error: Error) => {
  console.log("stop here: uncaughtException");
  console.log(error);

  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("stop here: unhandledRejection");
  console.log(reason);

  server.close(() => {
    process.exit(1);
  });
});
