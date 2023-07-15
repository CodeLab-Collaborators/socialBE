"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainAppErrorHandler = void 0;
class mainAppErrorHandler extends Error {
    constructor(args) {
        super(args.message);
        this.isSuccess = true;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name || "Error";
        this.message = args.message;
        this.status = args.status;
        if (this.isSuccess !== undefined) {
            this.isSuccess = args.isSuccess;
        }
        Error.captureStackTrace(this);
    }
}
exports.mainAppErrorHandler = mainAppErrorHandler;
