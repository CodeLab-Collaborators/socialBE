"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const express_validator_1 = require("express-validator");
exports.validator = {
    createAdmin: [
        (0, express_validator_1.body)("email")
            .trim()
            .toLowerCase()
            .normalizeEmail()
            .isEmail()
            .withMessage("Please enter the a right Email"),
        (0, express_validator_1.body)("password")
            .trim()
            .isLength({ min: 5 })
            .withMessage("Please enter your choice password of at laste 5 character"),
        (0, express_validator_1.body)("confirm").custom((value, req) => {
            if (value !== req.body.password) {
                return "'Password doesn't match";
            }
            else {
                return true;
            }
        }),
    ],
};
