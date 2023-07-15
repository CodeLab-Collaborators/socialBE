"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    userName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    avatar: {
        type: String,
    },
    avatarID: {
        type: String,
    },
    verified: {
        type: Boolean,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("users", userModel);
