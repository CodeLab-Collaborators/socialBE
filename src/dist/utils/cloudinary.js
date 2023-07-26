"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: "newcodelabstudents24",
    api_key: "631571737476252",
    api_secret: "5JuVB7MjtouQqRrKU3zAjRg81zY",
    secure: true,
});
exports.default = cloudinary_1.v2;
