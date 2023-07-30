import express from "express";
import {
  createChat,
  getChat,
  getSpecificChat,
  unChatFriend,
} from "../controller/chatController";

const router = express.Router();

router.route("/:userID/:friendID/create-chat").post(createChat);

router.route("/:userID/get-chat").get(getChat);

router.route("/:userID/:friendID/get-a-chat").get(getSpecificChat);

router.route("/:chatID/delete-chat").delete(unChatFriend);

export default router;
