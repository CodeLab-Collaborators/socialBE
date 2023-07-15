import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
import { mainAppErrorHandler } from "./error/errorDefiner";
import { HTTP } from "./constants/HTTP";
import { errorHandler } from "./error/errorHandlers";
import user from "./router/userRoutes";
import oAuth from "./router/oAuthRouter";

export const mainApp = (app: Application) => {
  app
    .use(express.json())
    .use(cors())

    .use(
      cookieSession({
        name: `${process.env.SESSION_NAME}`,
        keys: [`${process.env.SESSION_KEY}`],
        maxAge: 2 * 60 * 60 * 100,
      }),
    )

    .use(function (req: any, res: Response, next: NextFunction) {
      if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb: any) => {
          cb();
        };
      }
      if (req.session && !req.session.save) {
        req.session.save = (cb: any) => {
          cb();
        };
      }
      next();
    })
    .use(passport.initialize())
    .use(passport.session())

    // custom auth
    .use("/api/social/user", user)
    //oAuth with google
    .use("/", oAuth)
    .all("*", (req: Request, res: Response, next: NextFunction) => {
      next(
        new mainAppErrorHandler({
          message: `This route ${req.originalUrl} doesn't exist`,
          status: HTTP.NOT_FOUND,
          name: "Route Error",
          isSuccess: false,
        }),
      );
    })

    .use(errorHandler);
};
