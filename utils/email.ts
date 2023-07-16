import { google } from "googleapis";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { iUser } from "./interfaces/userInterface";

// const GOOGLE_SECRET = "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";
// const GOOGLE_ID =
//   "1054310070984-bqesvn0ftgmhcn6p6292jskt91rk4n5e.apps.googleusercontent.com";
// const GOOGLE_REFRESHTOKEN =
//   "1//04dIMtDvNwamFCgYIARAAGAQSNwF-L9IrFJgJO7AzsDu8l4eJ0xQq5VcPSg9TL3sYVHufYPXj-inHC6ApFpP7hvl8goZR32Cd9TY";
// const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";

const GOOGLE_SECRET = "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";
const GOOGLE_ID =
  "56883592068-u7a5efehhqtgciohe4ifkcrc16rl11n3.apps.googleusercontent.com";
const GOOGLE_REFRESHTOKEN =
  "1//04HHfERxjfWs1CgYIARAAGAQSNwF-L9Ir5w--rSOJ1K0kSg0qgG55Xnmd2Ip_C80aUlzE_ZQoKE-S8QflvDcp0MkrumD9dfO1QPo";
const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);

oAuth.setCredentials({ refresh_token: GOOGLE_REFRESHTOKEN });

const url: string = "https://social-connect-797u.onrender.com/api/social/user";

export const verifiedUserMail = async (user: any) => {
  try {
    const accessToken = await oAuth.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "gotext24@gmail.com",
        refreshToken: accessToken.token,
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        accessToken: GOOGLE_REFRESHTOKEN,
      },
    });

    const buildFile = path.join(__dirname, "../views/AccountCreated.ejs");

    const data = await ejs.renderFile(buildFile, {
      userName: user.userName,
      email: user.email,
      id: user?.id,
      role: user.role,
      token: user.token,
      url,
    });

    const mailOptions = {
      from: "AJ Connect ❤❤❤ <gotext24@gmail.com>",
      to: user.email,
      subject: "Account Verification",
      html: data,
    };

    transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};

export const resetUserPassword = async (user: any) => {
  try {
    const accessToken = await oAuth.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "gotext24@gmail.com",
        refreshToken: accessToken.token,
        clientId: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        accessToken: GOOGLE_REFRESHTOKEN,
      },
    });

    const buildFile = path.join(__dirname, "../views/passwordReset.ejs");
    const data = await ejs.renderFile(buildFile, {
      userName: user.userName,
      id: user.id,
      token: user.token,
      url,
    });

    const mailOptions = {
      from: "AJ Connect ❤❤❤ <gotext24@gmail.com>",
      to: user?.email,
      subject: "Reset Password",
      html: data,
    };

    transporter.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};
