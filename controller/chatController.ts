import { Request, Response } from "express";
import userModel from "../model/userModel";
import chatModel from "../model/chat/chatModel";

export const createChat = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const userFriends = await userModel.findById(userID).populate({
      path: "friends",
    });

    const findFriends = userFriends?.friends?.find((el: string) => {
      return el === friendID;
    });

    if (findFriends) {
      const chat = await chatModel.create({
        member: [userID, friendID],
      });

      return res.status(201).json({
        message: "create chat",
        data: chat,
      });
    } else {
      return res.status(404).json({
        message: "Should be a friend first",
      });
    }
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const unChatFriend = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID, chatID } = req.params;

    const user: any = await userModel.findById(userID);
    const friend: any = await userModel.findById(friendID);

    if (user && friend) {
      const deleteChat = await chatModel.findByIdAndDelete(chatID);

      return res.status(200).json({
        message: "chat has been removed from youe collections",
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

export const getChat = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const getChatt = await chatModel.find({
      member: {
        $in: [userID],
      },
    });

    return res.status(200).json({
      message: "getting chats",
      data: getChatt,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};

export const getSpecificChat = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const chatt = await chatModel.findOne({
      member: {
        $all: [userID, friendID],
      },
    });

    return res.status(200).json({
      message: "getting chats",
      data: chatt,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Error",
    });
  }
};
