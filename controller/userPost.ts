import {Request,Response} from "express"
import postModel from "../model/postModel"
import { HTTP } from "../constants/HTTP"
import { mainAppErrorHandler } from "../error/errorDefiner"
import userModel from "../model/userModel"
import jwt from "jsonwebtoken"





//get all post 
export const getSingleUserPost = async( req:Request,res:Response):Promise<Response>=>{
    try {
        
        //get authorization 
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
          return res.status(HTTP.OK).json({
            message: "Invalid Token",
          });
        }
        //decrypting the token
        const requestUser = jwt.verify(token, "veriedRefreshedUser");

        //knowing who is the user
        const user = await userModel.findOne({ email: requestUser.email });

        //getting the post of that particular user
         const posting = await postModel.find({ user: user!._id });

        return res.status(HTTP.OK).json({
          message: `Gotten all ${posting.length} posts by ${user?.userName}`,
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
      const user = await userModel.findOne({ email: requestUser.email });

      const { tittle, content, mediaFile } = req.body;

      if (!req.body) {
        return res.status(HTTP.FORBIDDEN).json({
          message: "This post can not be created",
        });
      } else {
        const creatingPosting = await postModel.create({
          tittle,
          content,
          mediaFile,
          user: user,
        });

        return res.status(HTTP.CREATED).json({
          message: "your post has been created",
          data: creatingPosting,
        });
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

export const deleteUserPost = async(req:Request,res:Response):Promise<Response>=>{
    try {
      //get authorization
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(HTTP.OK).json({
          message: "Invalid Token",
        });
      }
      //decrypting the token
      const requestUser = jwt.verify(token, "veriedRefreshedUser");

      //knowing who is the user
      const user = await userModel.findOne({ email: requestUser.email });

      const { ID } = req.params;

      const userPost = await postModel.findById(ID)

      if(user?._id === userPost!.user) {
        userPost?.deleteOne;
            return res.json(HTTP.OK).json({
        message: "Your post have been  successfully deleted",
        });
      } else {
        return res.status(404).json({
            message:"this action is not allowed"
        })
      }

     
    } catch (error) {
        new mainAppErrorHandler({
            message:"Unable to delete te user post",
            status:HTTP.BAD_REQUEST,
            name:"remove post error",
            isSuccess: false,
        });

        return res.status(HTTP.BAD_REQUEST).json({
            message:'An error occurred while deleting',
            data:error
        })
    }

}