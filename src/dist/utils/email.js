"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUserPassword = exports.verifiedUserMail = void 0;
const googleapis_1 = require("googleapis");
const nodemailer_1 = __importDefault(require("nodemailer"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const GOOGLE_SECRET = "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";
const GOOGLE_ID = "1054310070984-bqesvn0ftgmhcn6p6292jskt91rk4n5e.apps.googleusercontent.com";
const GOOGLE_REFRESHTOKEN = "1//04dIMtDvNwamFCgYIARAAGAQSNwF-L9IrFJgJO7AzsDu8l4eJ0xQq5VcPSg9TL3sYVHufYPXj-inHC6ApFpP7hvl8goZR32Cd9TY";
const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_REDIRECT);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESHTOKEN });
const url = "http://localhost:3455/api/social/user";
const verifiedUserMail = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "georgeseo06@gmail.com",
                refreshToken: accessToken.token,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: GOOGLE_REFRESHTOKEN,
            },
        });
        const buildFile = path_1.default.join(__dirname, "../views/AccountCreated.ejs");
        const data = yield ejs_1.default.renderFile(buildFile, {
            userName: admin.userName,
            email: admin.email,
            id: admin === null || admin === void 0 ? void 0 : admin.id,
            role: admin.role,
            token: admin.token,
            url,
        });
        const mailOptions = {
            from: "AJ Connect ❤❤❤ <georgeseo06@gmail.com>",
            to: admin.email,
            subject: "Account Verification",
            html: data,
        };
        transporter.sendMail(mailOptions);
    }
    catch (error) {
        return error;
    }
});
exports.verifiedUserMail = verifiedUserMail;
const resetUserPassword = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "georgeseo06@gmail.com",
                refreshToken: accessToken.token,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: GOOGLE_REFRESHTOKEN,
            },
        });
        const buildFile = path_1.default.join(__dirname, "../views/passwordReset.ejs");
        const data = yield ejs_1.default.renderFile(buildFile, {
            userName: admin.userName,
            id: admin.id,
            token: admin.token,
            url,
        });
        const mailOptions = {
            from: "AJ Connect ❤❤❤ <georgeseo06@gmail.com>",
            to: admin === null || admin === void 0 ? void 0 : admin.email,
            subject: "Reset Password",
            html: data,
        };
        transporter.sendMail(mailOptions);
    }
    catch (error) {
        return error;
    }
});
exports.resetUserPassword = resetUserPassword;
