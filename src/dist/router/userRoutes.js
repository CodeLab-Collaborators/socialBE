"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controller/UserController");
const multer_1 = __importDefault(require("multer"));
let uploadData = (0, multer_1.default)();
const router = express_1.default.Router();
router.route("/").get(UserController_1.getUser);
router.route("/:id/get-one").get(UserController_1.getOneUser);
router.route("/:id/image").patch(uploadData.single("avatar"), UserController_1.updateUserImage);
router
    .route("/:id/cover-image")
    .patch(uploadData.single("avatar"), UserController_1.updateUserCoverImage);
router.route("/:id/update-info").patch(UserController_1.updateUser);
router.route("/:id/delete-account").delete(UserController_1.deleteUser);
router.route("/register").post(UserController_1.createUser);
router.route("/:id/:token/verify").get(UserController_1.verifyUser);
router.route("/reset-password").patch(UserController_1.resetMail);
router.route("/:id/:token/change-password").patch(UserController_1.changePassword);
router.route("/sign-in").post(UserController_1.signin);
router.route("/refresh-access-token").post(UserController_1.refreshUserToken);
exports.default = router;
