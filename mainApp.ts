import express, { Application, NextFunction, Request, Response, request } from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
import { mainAppErrorHandler } from "./error/errorDefiner";
import { HTTP } from "./constants/HTTP";
import { errorHandler } from "./error/errorHandlers";
import user from "./router/userRoutes";
import userpost from "./router/postRouter"
import oAuth from "./router/oAuthRouter";
import morgan from "morgan"

export const mainApp = (app: Application) => {
  app
    .use(express.json())
    .use(cors({ origin: "*" }))
    .use(morgan("dev"))

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
    .get("/", (req: Request, res: Response) => {
      try {
        res.status(HTTP.OK).json({ message: "Loading Entry" });
      } catch (error) {
        res.status(HTTP.BAD_GATEWAY).json({
          message: "Error loading entry",
        });
      }
    })
    // custom auth
    .use("/api/social/auth", user)

    .use("/api/posts", userpost )
  
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
