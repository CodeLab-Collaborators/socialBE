import { Request, Response } from "express";
import userModel from "../model/userModel";
import postModel from "../model/postModel";

export const beLike = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, postID } = req.params;

    const user = await userModel.findById(userID);
    const post = await postModel.findById(postID);

    if (user && post) {
      post?.like?.push(userID);
      post?.save();

      return res.status(200).json({
        message: "Your like has been recorded ",
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

export const unLike = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, postID } = req.params;

    const user: any = await userModel.findById(userID);
    const post: any = await postModel.findById(postID);

    if (user && post) {
      const checkPost = post.like?.some((el: string) => el === userID);

      if (checkPost) {
        post!.like?.pull(userID);
        post.save();
      }

      return res.status(200).json({
        message: "You have unlike this post",
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
