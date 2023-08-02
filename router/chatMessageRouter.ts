import express from "express";
import {
  createChatMessage,
  readChatMessage,
} from "../controller/chatMessageController";

const router = express.Router();

router.route("/:userID/:chatID/create-chat-message").post(createChatMessage);

router.route("/:chatID/get-chat-message").get(readChatMessage);

export default router;
