import { Request, Response } from "express";
import { UserEntity } from "../model/AdminEntity/UserEntity";
import { HTTP } from "../utils/constants/HTTP";
import { mainAppErrorHandler } from "../utils/error/errorDefiner";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { mainRoles } from "../utils/constants/roles";
import crypto from "crypto";
import { resetUserPassword, verifiedUserMail } from "../utils/email";
import { exchanger } from "../utils/Exchanger";

export const getUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const schools = await UserEntity.find();
    return res.status(HTTP.OK).json({
      message: "Viewing all schools",
      data: schools,
    });
  } catch (err: any) {
    new mainAppErrorHandler({
      message: `Unable to view schools for Admin`,
      status: HTTP.BAD_REQUEST,
      name: "School creation Error",
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
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;

    const school = await UserEntity.findOne({
      where: {
        id,
      },
      relations: ["student", "course", "schoolLevels"],
    });
    return res.status(HTTP.OK).json({
      message: "Viewing school detail",
      data: school,
    });
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

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;

    const removedSchool = await UserEntity.delete({ id });

    return res.status(HTTP.OK).json({
      message: "school has been delete",
      data: removedSchool,
    });
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

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { userName } = req.body;

    const school = await UserEntity.findOne({
      where: {
        id,
      },
    });

    const updateSchoolInfo = await UserEntity.merge(school, { userName });
    updateSchoolInfo.save();

    return res.status(HTTP.OK).json({
      message: "Updating school's info",
      data: updateSchoolInfo,
    });
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

export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { schoolName, userName, email, password } = req.body;
    const tokenData = crypto.randomBytes(16).toString("hex");
    console.log(tokenData);
    const checkIfExist = await UserEntity.findOne({
      where: { email },
    });

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
          message: "PLease enter your choice password",
        });
      } else {
        const slt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, slt);

        const admin = await UserEntity.create({
          userName,
          email,
          password: hash,
          token: tokenData,
          verified: false,
        }).save();

        verifiedUserMail(admin)
          .then((result) => {
            console.log("message been sent to you: ");
          })
          .catch((error) => console.log(error));

        return res.status(HTTP.CREATED).json({
          message: "Please check your mail to verify your account",
          data: admin,
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
      data: err.message,
    });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id, token } = req.params;

    const findAdmin = await UserEntity.findOne({
      where: { id },
    });

    if (!findAdmin) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does not exist",
      });
    } else {
      if (findAdmin.token !== "" && findAdmin.token === token) {
        const admin = await UserEntity.merge(findAdmin, {
          token: "",
          verified: true,
        }).save();

        return res.status(HTTP.OK).json({
          message: "Your account has been verified, you can nnow sign in...!",
          data: admin,
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

export const resetMail = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id, token } = req.params;
    const { email } = req.body;

    const findAdmin = await UserEntity.findOne({
      where: { email },
    });

    if (!findAdmin) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does not exist",
      });
    } else {
      if (findAdmin.token === "" && findAdmin.verified === true) {
        const newToken = crypto.randomBytes(32).toString("hex");
        const admin = await UserEntity.merge(findAdmin, {
          token: newToken,
        }).save();

        resetUserPassword(admin)
          .then((result) => {
            console.log("message been sent to you: ");
          })
          .catch((error) => console.log(error));

        return res.status(HTTP.OK).json({
          message: "Please check your email to continue",
          data: admin,
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

export const changePassword = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const findAdmin = await UserEntity.findOne({
      where: { id },
    });

    if (!findAdmin) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does not exist",
      });
    } else {
      if (findAdmin.token !== "" && findAdmin.token === token) {
        const slt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, slt);

        const admin = await UserEntity.merge(findAdmin, {
          password: hashed,
          token: "",
        }).save();

        return res.status(HTTP.OK).json({
          message: "Your password has been changed, you can now sign in",
          data: admin,
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

export const signin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const findAdmin = await UserEntity.findOne({
      where: { email },
    });

    if (!findAdmin) {
      return res.status(HTTP.FORBIDDEN).json({
        message: "This user does not exist",
      });
    } else {
      if (findAdmin.token === "" && findAdmin.verified === true) {
        console.log("check for Password");

        const decryptPassword = await bcrypt.compare(
          password,
          findAdmin.password,
        );

        if (decryptPassword) {
          const encrypt = jwt.sign(
            {
              id: findAdmin.id,
              email: findAdmin.email,
              userName: findAdmin.userName,
              verified: findAdmin.verified,
            },
            process.env.SIG_SECRET,
            { expiresIn: process.env.SIG_EXPIRES },
          );

          const refreshToken = jwt.sign(
            {
              id: findAdmin.id,
              email: findAdmin.email,
              userName: findAdmin.userName,
              verified: findAdmin.verified,
            },
            "veriedRefreshedUser",
            { expiresIn: "2m" },
          );

          exchanger(process.env.EXCHANGED_PATH, {
            encrypt,
            refreshToken,
          });

          return res.status(HTTP.OK).json({
            message: `Welcome back ${findAdmin.userName}`,
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
      (err: Error, payload: jwt.JwtPayload) => {
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
              email: payload.email,
              password: payload.password,
              verified: payload.verified,
            },
            process.env.SIG_SECRET,
            { expiresIn: process.env.SIG_EXPIRES },
          );
          const refreshToken = req.body.refresh;

          res.status(200).json({
            message: "signin ",
            data: { encrypt, refreshToken },
          });
        }
      },
    );
  } catch (error) {
    console.log(error);
  }
};