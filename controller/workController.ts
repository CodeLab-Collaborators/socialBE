import { Request, Response } from "express";
import { HTTP } from "../constants/HTTP";
import jwt from "jsonwebtoken";
import userModel from "../model/userModel";
import workAtModel from "../model/workAtModel";
import mongoose from "mongoose";
import { mainAppErrorHandler } from "../error/errorDefiner";

export const createNewWork = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    //get authorization
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(HTTP.OK).json({
        message: "Invalid Token",
      });
    }

    //decrypting the token
    const requestUser = jwt.verify(token, "veriedRefreshedUser");

    //tie the post to the user

    if (!token) {
      return res.status(HTTP.OK).json({
        message: "Invalid Token",
      });
    }

    const { workPlace, workLocation, startedAt, endsAt } = req.body;

    const user: any = await userModel.findById(userID);

    if (user) {
      const work = await workAtModel.create({
        workPlace,
        workLocation,
        startedAt,
        endsAt,

        userID: user!._id,
        user,
      });

      user.workAt?.push(new mongoose.Types.ObjectId(work!._id));
      user!.save();

      return res.status(HTTP.CREATED).json({
        message: "your post has been created",
        data: work,
      });
    }
  } catch (error) {
    new mainAppErrorHandler({
      message: `unable to create a post`,
      status: HTTP.BAD_REQUEST,
      name: "post craeting error",
      isSuccess: false,
    });
    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error found",
      data: error,
    });
  }
};

//get users' work info
export const getUserWorkHistory = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const workInfo = await userModel.findById(userID).populate({
      path: "work",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(HTTP.OK).json({
      message: `Gotten all ${workInfo?.userName}'s work history`,
      data: workInfo,
    });
  } catch (error) {
    new mainAppErrorHandler({
      message: "Unable to get all post",
      status: HTTP.BAD_REQUEST,
      name: "User posting error",
      isSuccess: false,
    });
    return res.status(HTTP.OK).json({
      message: "Error found",
      data: error,
    });
  }
};

//get users' work terminate
export const terminateUserWork = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, workID } = req.params;

    const userInfo: any = await userModel.findById(userID);
    const workInfo = await workAtModel.findByIdAndDelete(workID);

    userInfo?.workAt!.pull(new mongoose.Types.ObjectId(workID));
    userInfo?.save();

    return res.status(HTTP.OK).json({
      message: `Gotten all ${userInfo?.userName}'s work history`,
      data: workInfo,
    });
  } catch (error) {
    new mainAppErrorHandler({
      message: "Unable to get all post",
      status: HTTP.BAD_REQUEST,
      name: "User posting error",
      isSuccess: false,
    });
    return res.status(HTTP.OK).json({
      message: "Error found",
      data: error,
    });
  }
};

//get users' work ends
export const endAWorkInfo = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, workID } = req.params;

    const userInfo: any = await userModel.findById(userID);
    if (userInfo) {
      const workInfo = await workAtModel.findByIdAndUpdate(
        workID,
        {
          endsAt: Date.now(),
        },
        { new: true },
      );

      return res.status(HTTP.OK).json({
        message: `Ends ${userInfo?.userName}'s work journey with ${workInfo?.workPlace}`,
        data: workInfo,
      });
    } else {
      return res.status(HTTP.BAD_REQUEST).json({
        message: "User not Authozied",
      });
    }
  } catch (error) {
    new mainAppErrorHandler({
      message: "Unable to get all post",
      status: HTTP.BAD_REQUEST,
      name: "User posting error",
      isSuccess: false,
    });
    return res.status(HTTP.OK).json({
      message: "Error found",
      data: error,
    });
  }
};
