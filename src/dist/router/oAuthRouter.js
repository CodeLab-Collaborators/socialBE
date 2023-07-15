"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
require("../controller/googleOAuth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HTTP_1 = require("../constants/HTTP");
const router = express_1.default.Router();
router.route("/ms").get((req, res) => {
    res.status(200).json({ message: "enter" });
});
router.route("/success").get((req, res) => {
    const userData = req.user;
    const encrypt = jsonwebtoken_1.default.sign({
        id: userData === null || userData === void 0 ? void 0 : userData.id,
    }, process.env.SIG_SECRET, { expiresIn: process.env.SIG_EXPIRES });
    return res.status(HTTP_1.HTTP.OK).json({
        message: `Welcome back ${userData.userName} `,
        data: { userData, encrypt },
    });
});
router.route("/failure").get((req, res) => {
    return res.status(HTTP_1.HTTP.NOT_FOUND).json({
        message: "This is bad page",
    });
});
router
    .route("/api/with-google/google-auth")
    .get(passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.route("/auth/google/callback").get(passport_1.default.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
}));
exports.default = router;
