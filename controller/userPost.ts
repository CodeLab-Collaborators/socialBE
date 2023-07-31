import {Request,Response} from "express"
import postModel from "../model/postModel"
import { HTTP } from "../constants/HTTP"
import { mainAppErrorHandler } from "../error/errorDefiner"
import userModel from "../model/userModel"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";

//get all post
export const getAllPost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const posting = await postModel.find();
    return res.status(HTTP.OK).json({
      message: `Gotten all ${posting.length} posts by users`,
      data: posting,
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

//get users' post
export const getUserPosts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const posting = await userModel.findById(userID).populate({
      path: "post",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    return res.status(HTTP.OK).json({
      message: `Gotten all ${posting?.userName}'s posts`,
      data: posting,
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


//get users' post
export const getUserFriendPosts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID } = req.params;

    const friend: any = await userModel.findById(userID).populate({
      path: "friends",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    const posted = await postModel.find();
        
    function getFriendPost(userID: any) {
      return friend.friends.includes(userID);
    }

    const matchedPosts = posted.filter((post) => getFriendPost(post.userID));
    
    return res.status(HTTP.OK).json({
      message: `Gotten all my friends posts`,
      data: matchedPosts,
    });
    
  } catch (error:any) {
    new mainAppErrorHandler({
      message: "Unable to get all post",
      status: HTTP.BAD_REQUEST,
      name: "User posting error",
      isSuccess: false,
    });
    return res.status(HTTP.OK).json({
      message: "Error found",
      data: error.message,
    });
  }
};


//get all post 
export const getSingleUserPost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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
      data: posting,
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

//delete users' post
export const deleteUserPosts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, postID } = req.params;

    const user: any = await userModel.findById(userID);

    if (user) {
      await postModel.findByIdAndDelete(postID);

      user?.post?.pull(new mongoose.Types.ObjectId(postID));
      user.save();

      return res.status(HTTP.CREATED).json({
        message: `posts delete`,
      });
    } else {
      return res.status(HTTP.OK).json({
        message: `You are not Authorized for This`,
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

export const createPost = async (req: any, res: Response) => {
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

      const { post } = req.body;

      const whoPosted = await userModel.findById(userID);
      if (whoPosted) {
        let streamUpload = async (req: any) => {
          return new Promise(async (resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream((error, result) => {
              if (result) {
                return resolve(result);
              } else {
                return reject(error);
              }
            });

            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };

        const image: any = await streamUpload(req);

        const creatingPost = await postModel.create({
          post,

          mediaFile: image.secure_url,
          mediaFileID: image.public_id,
          userID: whoPosted!._id,
          user: whoPosted,
        });

        whoPosted.post?.push(new mongoose.Types.ObjectId(creatingPost._id));
        whoPosted.save();

        return res.status(HTTP.CREATED).json({
          message: "your post has been created",
          data: creatingPost,
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

export const deleteUserPost = async (
  req: Request,
  res: Response,
): Promise<Response> => {
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
    const user: any = await userModel.findOne({ email: requestUser.email });

    const { ID } = req.params;

    const userPost = await postModel.findById(ID);

    if (user?._id === userPost!.user) {
      userPost?.deleteOne;

      user?.post?.pull(new mongoose.Types.ObjectId(userPost?._id));
      user.save();

      return res.json(HTTP.OK).json({
        message: "Your post have been  successfully deleted",
      });
    } else {
      return res.status(404).json({
        message: "this action is not allowed",
      });
    }
  } catch (error) {
    new mainAppErrorHandler({
      message: "Unable to delete te user post",
      status: HTTP.BAD_REQUEST,
      name: "remove post error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "An error occurred while deleting",
      data: error,
    });
  }
};

//like users' post
export const likeUserPosts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, postID } = req.params;

    const user = await userModel.findById(userID);

    if (user) {
      const likePost = await postModel.findById(postID);

      likePost?.like.push(userID!);
      likePost?.save();

      return res.status(HTTP.CREATED).json({
        message: `posts likeed by ${user?.userName}`,
      });
    } else {
      return res.status(HTTP.OK).json({
        message: `You are not Authorized for This`,
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

//unlike users' post
export const unLikeUserPosts = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { userID, postID } = req.params;

    const user = await userModel.findById(userID);

    if (user) {
      const likePost: any = await postModel.findById(postID);

      likePost?.like.pull(new mongoose.Types.ObjectId(userID));
      likePost?.save();

      return res.status(HTTP.CREATED).json({
        message: `posts unliked by ${user?.userName}`,
        data: likePost,
      });
    } else {
      return res.status(HTTP.OK).json({
        message: `You are not Authorized for This`,
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
  
