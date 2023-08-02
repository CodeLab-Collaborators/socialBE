import { Request, Response } from "express";
import userModel from "../model/userModel";

export const beFollowed = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const user = await userModel.findById(userID);
    const friend = await userModel.findById(friendID);

    if (user && friend) {
      user?.followers?.push(friendID);
      user?.save();

      friend?.followings?.push(userID);
      friend?.save();

      return res.status(200).json({
        message: "You're now following a Friend",
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

export const unFollowed = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, friendID } = req.params;

    const user: any = await userModel.findById(userID);
    const friend: any = await userModel.findById(friendID);

    if (user && friend) {
      const checkUser = user.followers?.some((el: string) => el === friendID);

      const checkFriend = friend.following?.some((el: string) => el === userID);

      if (checkUser) {
        user!.followers?.pull(friendID);
        user.save();
      }

      if (checkFriend) {
        friend!.followings?.pull(userID);
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
