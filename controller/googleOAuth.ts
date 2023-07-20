import myStrategy from "passport-google-oauth20";
import passport from "passport";

import dot from "dotenv";
import userModel from "../model/userModel";
dot.config();

const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const Github = require("passport-github2").Strategy;

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: any,
      callback: any
    ) => {
      const checkUser = await userModel.findOne({ email: profile._json.email });

      if (checkUser) {
        return callback(null, checkUser);
      } else {
        const userCreated = await userModel.create({
          email: profile._json.email,
          userName: profile.name.familyName,
          token: "",
          verified: profile._json.email_verified,
        });

        return callback(null, userCreated);
      }
    }
  )
);

// const GITHUB_ID = process.env.GITHUB_ID;
// const GITHUB_SECRET = process.env.GITHUB_SECRET;

// passport.use(
//   new Github(
//     {
//       clientID: GITHUB_ID,
//       clientSecret: GITHUB_SECRET,
//       callbackURL: "/auth/github/callback",
//       scope: ["profile", "email"],
//     },
//     async (
//       accessToken: any,
//       refreshToken: any,
//       profile: any,
//       callback: any,
//     ) => {
//       console.log(profile);
//       return callback(null, profile);

//       // const checkUser = await userModel.findOne({ email: profile._json.email });

//       // if (checkUser) {
//       //   return callback(null, profile);
//       // } else {
//       //   await userModel.create(
//       //     {
//       //       // _id: profile.id,
//       //       fullName: profile.displayName,
//       //       email: profile._json.email,
//       //       userName: profile.name.familyName,
//       //       avatar: profile.photos[0].value,
//       //       status: "General",
//       //       token: "",
//       //       verified: profile._json.email_verified,
//       //     },
//       //     function (err, user) {
//       //       return callback(null, user);
//       //     },
//       //   );
//       // }
//     },
//   ),
// );

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user!);
});
