"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorDefiner_1 = require("../error/errorDefiner");
const HTTP_1 = require("../constants/HTTP");
dotenv_1.default.config();
const url = process.env.MONGOOSE_DB;
const db = () => {
    try {
        mongoose_1.default
            .connect(url)
            .then(() => {
            console.log("starting server and db connected: 🚀🚀💸💌🚀");
        })
            .catch((err) => {
            new errorDefiner_1.mainAppErrorHandler({
                message: `Unable to connect to MongoDB Database`,
                status: HTTP_1.HTTP.BAD_GATEWAY,
                name: "mongodb connection Error",
                isSuccess: false,
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.db = db;
