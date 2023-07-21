import { Request, Response, NextFunction } from "express";
import { iSocialUser } from "../utils/interfaces/userInterface";
import mongoose from "mongoose";

interface iSocialUserData extends iSocialUser, mongoose.Document {}

const userModel = new mongoose.Schema(
  {
    userName: {
      type: String,
    },

    fullName: {
      type: String,
    },

    location: {
      type: String,
    },

    profession: {
      type: String,
    },

    placeOfBirth: {
      type: String,
    },

    secondarySchool: {
      type: String,
    },

    college: {
      type: String,
    },

    address: {
      type: String,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    token: {
      type: String,
    },

    avatar: {
      type: String,
    },

    avatarID: {
      type: String,
    },

    verified: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export default mongoose.model<iSocialUserData>("users", userModel);