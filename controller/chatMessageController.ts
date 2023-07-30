import { Request, Response } from "express";
import chatModel from "../model/chat/chatModel";
import chatMessage from "../model/chat/chatMessage";
import userModel from "../model/userModel";

export const createChatMessage = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, chatID } = req.params;
    const { message } = req.body;

    const chatExit = await chatModel.findById(chatID);
    const userExit = await userModel.findById(userID);

    console.log("chat: ", chatExit);
    console.log("user: ", userExit);

    if (chatExit && userExit) {
      const chatMessages = await chatMessage.create({
        userID: userExit._id,
        chatID: chatExit._id,
        message,
      });

      return res.status(201).json({
        message: "chat message create",
        data: chatMessages,
      });
    } else {
      return res.status(404).json({
        message: "Something isn't right",
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const readChatMessage = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { chatID } = req.params;

    const chatMessages = await chatMessage
      .find({
        chatID,
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "viewing chat message",
      data: chatMessages,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};
