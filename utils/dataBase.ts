import mongoose from "mongoose";
import env from "dotenv";
import { mainAppErrorHandler } from "../error/errorDefiner";
import { HTTP } from "../constants/HTTP";
env.config();

const url = process.env.MONGOOSE_DB;

export const db = () => {
  try {
    mongoose
      .connect(url!)
      .then(() => {
        console.log("starting server and db connected: 🚀🚀💸💌🚀");
      })
      .catch((err) => {
        new mainAppErrorHandler({
          message: `Unable to connect to MongoDB Database`,
          status: HTTP.BAD_GATEWAY,
          name: "mongodb connection Error",
          isSuccess: false,
        });
      });
  } catch (error) {
    console.log(error);
  }
};
