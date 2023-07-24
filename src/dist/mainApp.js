"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const passport_1 = __importDefault(require("passport"));
const errorDefiner_1 = require("./error/errorDefiner");
const HTTP_1 = require("./constants/HTTP");
const errorHandlers_1 = require("./error/errorHandlers");
const userRoutes_1 = __importDefault(require("./router/userRoutes"));
const oAuthRouter_1 = __importDefault(require("./router/oAuthRouter"));
const morgan_1 = __importDefault(require("morgan"));
const mainApp = (app) => {
    app
        .use(express_1.default.json())
        .use((0, cors_1.default)({ origin: "*" }))
        .use((0, morgan_1.default)("dev"))
        .use((0, cookie_session_1.default)({
        name: `${process.env.SESSION_NAME}`,
        keys: [`${process.env.SESSION_KEY}`],
        maxAge: 2 * 60 * 60 * 100,
    }))
        .use(function (req, res, next) {
        if (req.session && !req.session.regenerate) {
            req.session.regenerate = (cb) => {
                cb();
            };
        }
        if (req.session && !req.session.save) {
            req.session.save = (cb) => {
                cb();
            };
        }
        next();
    })
        .use(passport_1.default.initialize())
        .use(passport_1.default.session())
        .get("/", (req, res) => {
        try {
            res.status(HTTP_1.HTTP.OK).json({ message: "Loading Entry" });
        }
        catch (error) {
            res.status(HTTP_1.HTTP.BAD_GATEWAY).json({
                message: "Error loading entry",
            });
        }
    })
        // custom auth
        .use("/api/social/auth", userRoutes_1.default)
        //oAuth with google
        .use("/", oAuthRouter_1.default)
        .all("*", (req, res, next) => {
        next(new errorDefiner_1.mainAppErrorHandler({
            message: `This route ${req.originalUrl} doesn't exist`,
            status: HTTP_1.HTTP.NOT_FOUND,
            name: "Route Error",
            isSuccess: false,
        }));
    })
        .use(errorHandlers_1.errorHandler);
};
exports.mainApp = mainApp;
