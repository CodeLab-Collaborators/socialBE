import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { resetUserPassword, verifiedUserMail } from "../utils/email";

import userModel from "../model/userModel";
import { HTTP } from "../constants/HTTP";
import { mainAppErrorHandler } from "../error/errorDefiner";
import streamifier from "streamifier";

//getting all user 
export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const users = await userModel.find();

    return res.status(HTTP.OK).json({
      message: `Viewing all ${users.length} users`,
      data: users,
    });
  } catch (err: any) {
    new mainAppErrorHandler({
      message: `Unable to view user`,
      status: HTTP.BAD_REQUEST,
      name: "view user Error",
      isSuccess: false,
    });

    return res.status(HTTP.OK).json({
      message: "Error Found",
      data: err,
    });
  }
};

export const getOneUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    return res.status(HTTP.OK).json({
      message: "Viewing user detail",
      data: user,
    });
  } catch (err) {
    new mainAppErrorHandler({
      message: `Unable to view user`,
      status: HTTP.BAD_REQUEST,
      name: "user detail Error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error Found",
      data: err,
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    const removeUser = await userModel.findByIdAndDelete(id);

    return res.status(HTTP.OK).json({
      message: "user has been delete",
      data: removeUser,
    });
  } catch (err) {
    new mainAppErrorHandler({
      message: `Unable to create user`,
      status: HTTP.BAD_REQUEST,
      name: "remoev user Error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error Found",
      data: err,
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { userName } = req.body;

    const user = await userModel.findByIdAndUpdate(
      id,
      { userName },
      { new: true }
    );

    return res.status(HTTP.OK).json({
      message: "Updating user's info",
      data: user,
    });
  } catch (err) {
    new mainAppErrorHandler({
      message: `Unable to update user`,
      status: HTTP.BAD_REQUEST,
      name: "user update Error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error Found",
      data: err,
    });
  }
};

//editing the user profile
export const editProfile = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "Account has been updated",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "an error occured while editing user profile",
    });
  }
};

export const updateUserImage = async (req: Request, res: Response) => {
  try {
    const pixID: any = await userModel.findById(req.params.id);
    console.log(pixID);

    if (pixID?.avatarID) {
      await cloudinary.uploader.destroy(pixID.avatarID);

      let streamUpload = async (req: any) => {
        return new Promise(async (resolve, reject) => {
          let stream = await cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                return resolve(result);
              } else {
                return reject(error);
              }
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const image: any = await streamUpload(req);

      const viewUser = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          avatar: image.secure_url,
          avatarID: image.public_id,
        },
        { new: true }
      );
      res.status(200).json({
        message: "user data updated",
        data: viewUser,
      });
    } else {
      let streamUpload = async (req: any) => {
        return new Promise(async (resolve, reject) => {
          let stream = await cloudinary.uploader.upload_stream(
            (error, result) => {
              if (result) {
                return resolve(result);
              } else {
                return reject(error);
              }
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      const image: any = await streamUpload(req);

      const viewUser = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          avatar: image.secure_url,
          avatarID: image.public_id,
        },
        { new: true }
      );
      res.status(200).json({
        message: "user data updated",
        data: viewUser,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fullName, userName, email, password } = req.body;
    const tokenData = crypto.randomBytes(16).toString("hex");
    console.log(tokenData);
    const checkIfExist = await userModel.findOne({ email });

    if (checkIfExist) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does exist",
      });
    } else {
      if (!password) {
        new mainAppErrorHandler({
          message: `Please put in a password`,
          status: HTTP.BAD_REQUEST,
          name: "No password Error",
          isSuccess: false,
        });

        return res.status(HTTP.BAD_REQUEST).json({
          message: "Please enter your choice password",
        });
      } else {
        const slt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, slt);

        const user = await userModel.create({
          fullName,
          userName,
          email,
          password: hash,
          token: tokenData,
          verified: false,
        });

        verifiedUserMail(user)
          .then((result) => {
            console.log("message been sent to you: ");
          })
          .catch((error) => console.log(error));

        return res.status(HTTP.CREATED).json({
          message: "Please check your mail to verify your account",
          data: user,
        });
      }
    }
  } catch (err: any) {
    new mainAppErrorHandler({
      message: `Unable to create school for Admin`,
      status: HTTP.BAD_REQUEST,
      name: "School creation Error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error Found",
      data: err,
    });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id, token } = req.params;

    const findUser = await userModel.findById(id);

    console.log(findUser);
    if (!findUser) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does not exist",
      });
    } else {
      if (findUser.token !== "" && findUser.token === token) {
        const user = await userModel.findByIdAndUpdate(
          id,
          {
            token: "",
            verified: true,
          },
          { new: true }
        );
        console.log("user: ", user);

        return res.status(HTTP.OK).json({
          message: "Your account has been verified, you can now sign in...!",
          data: user,
        });
      } else {
        return res.status(HTTP.ACCEPTED).json({ message: "done" });
      }
    }
  } catch (err) {
    new mainAppErrorHandler({
      message: `Unable to create school for Admin`,
      status: HTTP.BAD_REQUEST,
      name: "School creation Error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error Found",
      data: err,
    });
  }
};

export const resetMail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id, token } = req.params;
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does not exist",
      });
    } else {
      if (user.token === "" && user.verified === true) {
        const newToken = crypto.randomBytes(32).toString("hex");
        const userMail = await userModel.findByIdAndUpdate(
          user._id,
          {
            token: newToken,
          },
          { new: true }
        );

        resetUserPassword(userMail)
          .then((result) => {
            console.log("message been sent to you: ");
          })
          .catch((error) => console.log(error));

        return res.status(HTTP.OK).json({
          message: "Please check your email to continue",
          data: userMail,
        });
      } else {
        return res.status(HTTP.BAD_REQUEST).json({ message: "Error" });
      }
    }
  } catch (err) {
    new mainAppErrorHandler({
      message: `Unable to create school for Admin`,
      status: HTTP.BAD_REQUEST,
      name: "School creation Error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error Found",
      data: err,
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const findUser = await userModel.findById(id);

    if (!findUser) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does not exist",
      });
    } else {
      if (findUser.token !== "" && findUser.token === token) {
        const slt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, slt);

        const user = await userModel.findByIdAndUpdate(
          findUser._id,
          {
            password: hashed,
            token: "",
          },
          { new: true }
        );

        return res.status(HTTP.OK).json({
          message: "Your password has been changed, you can now sign in",
          data: user,
        });
      } else {
        return res.status(HTTP.FORBIDDEN).json({
          message: "Error",
        });
      }
    }
  } catch (err) {
    new mainAppErrorHandler({
      message: `Unable to change Password`,
      status: HTTP.BAD_REQUEST,
      name: "E Error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "Password error Found",
      data: err,
    });
  }
};

export const signin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does not exist",
      });
    } else {
      if (findUser.token === "" && findUser.verified === true) {
        const decryptPassword = await bcrypt.compare(
          password,
          findUser?.password!
        );

        if (decryptPassword) {
          const encrypt = jwt.sign(
            {
              id: findUser.id,
            },
            process.env.SIG_SECRET,
            { expiresIn: process.env.SIG_EXPIRES }
          );

          const refreshToken = jwt.sign(
            {
              id: findUser.id,
              email: findUser.email,
              userName: findUser.userName,
              verified: findUser.verified,
            },
            "veriedRefreshedUser",
            { expiresIn: "2m" }
          );

          return res.status(HTTP.OK).json({
            message: `Welcome back ${findUser.userName}`,
            data: { encrypt },
          });
        } else {
          return res.status(HTTP.FORBIDDEN).json({
            message: "Your password isn't correct",
          });
        }
      } else {
        return res.status(HTTP.FORBIDDEN).json({
          message: "This Account hasn't been Verified",
        });
      }
    }
  } catch (err) {
    new mainAppErrorHandler({
      message: `Unable to create school for Admin`,
      status: HTTP.BAD_REQUEST,
      name: "School creation Error",
      isSuccess: false,
    });

    return res.status(HTTP.BAD_REQUEST).json({
      message: "Error Found",
      data: err,
    });
  }
};

export const refreshUserToken = async (req: Request, res: Response) => {
  try {
    const { refresh } = req.body;

    jwt.verify(
      refresh,
      process.env.REFRESH_SECRET,
      (err: Error, payload: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            res.json({
              message: "token session has expired",
            });
          } else {
            throw err;
          }
        } else {
          const encrypt = jwt.sign(
            {
              id: payload.id,
            },
            process.env.SIG_SECRET,
            { expiresIn: process.env.SIG_EXPIRES }
          );
          const refreshToken = req.body.refresh;

          res.status(200).json({
            message: "signin ",
            data: { encrypt, refreshToken },
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
