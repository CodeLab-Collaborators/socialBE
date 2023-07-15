"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mainApp_1 = require("./mainApp");
const dotenv_1 = __importDefault(require("dotenv"));
const dataBase_1 = require("./utils/dataBase");
dotenv_1.default.config();
const port = parseInt(process.env.APP_PORT);
const app = (0, express_1.default)();
(0, mainApp_1.mainApp)(app);
const server = app.listen(process.env.PORT || port, () => {
    console.log("");
    console.log("server is ready to connect 🚀🚁🚀🚀");
    (0, dataBase_1.db)();
});
process.on("uncaughtException", (error) => {
    console.log("stop here: uncaughtException");
    console.log(error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("stop here: unhandledRejection");
    console.log(reason);
    server.close(() => {
        process.exit(1);
    });
});
