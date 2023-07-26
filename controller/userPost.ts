import {Request,Response} from "express"
import postModel from "../model/postModel"
import { HTTP } from "../constants/HTTP"
import { mainAppErrorHandler } from "../error/errorDefiner"
import userModel from "../model/userModel"
import jwt from "jsonwebtoken"





//get all post 
export const getAllPost = async( req:Request,res:Response):Promise<Response>=>{
    try {
        const posting  = await postModel.find()
        return res.status(HTTP.OK).json({
          message: `Gotten all ${posting.length} posts by users`,
          data: posting
        });
    } catch (error) {
        new mainAppErrorHandler({
            message:"Unable to get all post",
            status:HTTP.BAD_REQUEST,
            name:"User posting error",
            isSuccess:false,
        })
        return res.status(HTTP.OK).json({
            message:"Error found",
            data:error
        })
    }
}


export const createPost = async(req:Request,res:Response):Promise<Response>=>{
    try {

        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
          return res.status(HTTP.OK).json({
            message: "Invalid Token",
          });
        }

        const requestUser = jwt.verify(token, "veriedRefreshedUser");

          const { tittle, content, mediaFile } = req.body;
          
        if (!req.body) {
            return res.status(HTTP.FORBIDDEN).json({
                message:"This post can not be created",
            })
        } else {
            const creatingPosting = await postModel.create({
              tittle,
              content,
              mediaFile,
              user: requestUser._id,
            });

            return res.status(HTTP.CREATED).json({
                message:"your post has been created",
                data:creatingPosting
            })
        }
    } catch (error) {
        new mainAppErrorHandler({
            message:`unable to create a post`,
            status:HTTP.BAD_REQUEST,
            name:"post craeting error",
            isSuccess:false,
        })
        return res.status(HTTP.BAD_REQUEST).json({
            message:"Error found",
            data:error
        })
    }
}