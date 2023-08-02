import { Request, Response } from "express";
import userModel from "../model/userModel";

export const beFriend = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const user = await userModel.findById(userID);
    const friend = await userModel.findById(friendID);

    if (friend) {
      user?.friends?.push(friendID);
      user?.save();

      friend?.friends?.push(userID);
      friend?.save();

      return res.status(200).json({
        message: "You're now both Friends",
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

export const unFriend = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const user: any = await userModel.findById(userID);
    const friend: any = await userModel.findById(friendID);

    if (user && friend) {
      const checkUser = user.friends?.some((el: string) => el === friendID);
      const checkFriend = friend.friends?.some((el: string) => el === userID);

      if (checkUser) {
        user!.friends?.pull(friendID);
        user.save();
      }

      if (checkFriend) {
        friend!.friends?.pull(userID);
        friend.save();
      }

      return res.status(200).json({
        message: "You're both no more Friends",
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
