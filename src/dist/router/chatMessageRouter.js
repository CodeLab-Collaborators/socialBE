"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatMessageController_1 = require("../controller/chatMessageController");
const router = express_1.default.Router();
router.route("/:userID/:chatID/create-chat-message").post(chatMessageController_1.createChatMessage);
router.route("/:chatID/get-chat-message").get(chatMessageController_1.readChatMessage);
exports.default = router;
