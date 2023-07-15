"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (fx) => {
    return (req, res, next) => {
        return Promise.resolve(fx(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
