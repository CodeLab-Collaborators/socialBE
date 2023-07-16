import passport from "passport";
import express, { Request, Response } from "express";
import "../controller/googleOAuth";

import jwt from "jsonwebtoken";

import { HTTP } from "../constants/HTTP";
const router = express.Router();

router.route("/ms").get((req, res) => {
  res.status(200).json({ message: "enter" });
});

// https://social-connect-797u.onrender.com/api/with-google/google-auth

https: router.route("/success").get((req: Request, res: Response) => {
  const userData: any = req.user;

  const encrypt = jwt.sign(
    {
      id: userData?.id,
    },
    process.env.SIG_SECRET,
    { expiresIn: process.env.SIG_EXPIRES },
  );

  return res.status(HTTP.OK).json({
    message: `Welcome back ${userData.userName} `,
    data: { userData, encrypt },
  });
});

router.route("/failure").get((req, res) => {
  return res.status(HTTP.NOT_FOUND).json({
    message: "This is bad page",
  });
});

router
  .route("/api/with-google/google-auth")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router.route("/oauth2/redirect/google").get(
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  }),
);

export default router;
