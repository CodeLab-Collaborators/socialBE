"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary = cloudinary_1.default.v2;
cloudinary.config({
    cloud_name: "newcodelabstudents24",
    api_key: "631571737476252",
    api_secret: "5JuVB7MjtouQqRrKU3zAjRg81zY",
    secure: true,
});
exports.default = cloudinary;
