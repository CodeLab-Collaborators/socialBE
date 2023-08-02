"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controller/chatController");
const router = express_1.default.Router();
router.route("/:userID/:friendID/create-chat").post(chatController_1.createChat);
router.route("/:userID/get-chat").get(chatController_1.getChat);
router.route("/:userID/:friendID/get-a-chat").get(chatController_1.getSpecificChat);
router.route("/:chatID/delete-chat").delete(chatController_1.unChatFriend);
exports.default = router;
