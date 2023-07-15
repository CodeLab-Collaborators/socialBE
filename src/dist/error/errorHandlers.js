"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const HTTP_1 = require("../constants/HTTP");
const errorBuilder = (err, res) => {
    res.status(HTTP_1.HTTP.INTERNAL_SERVER_ERROR).json({
        name: err.name,
        message: err.message,
        status: err.status,
        stack: err.stack,
        error: err,
    });
};
const errorHandler = (err, req, res, next) => {
    errorBuilder(err, res);
};
exports.errorHandler = errorHandler;
