import { Request, Response } from "express";
import userModel from "../model/userModel";

export const beMentored = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const user = await userModel.findById(userID);
    const friend = await userModel.findById(friendID);

    if (user && friend) {
      user?.mentor?.push(friendID);
      user?.save();

      friend?.mentee?.push(userID);
      friend?.save();

      return res.status(200).json({
        message: `You're now a mentee to ${friend?.userName}`,
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

export const unMentored = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const user: any = await userModel.findById(userID);
    const friend: any = await userModel.findById(friendID);

    if (user && friend) {
      const checkUser = user?.mentor?.some((el: string) => el === friendID);

      const checkFriend = friend.mentee?.some((el: string) => el === userID);

      if (checkUser) {
        user!.mentor?.pull(friendID);
        user.save();
      }

      if (checkFriend) {
        friend!.mentee?.pull(userID);
        friend.save();
      }

      return res.status(200).json({
        message: `You're both no mentor to ${friend?.userName} `,
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
