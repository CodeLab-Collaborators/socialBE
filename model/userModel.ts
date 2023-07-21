
import { iSocialUser } from "../utils/interfaces/userInterface";
import mongoose from "mongoose";

interface iSocialUserData extends iSocialUser, mongoose.Document {}

const userModel = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: [true, "username already exist"],
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
      unique: true,
      trim: false,
      lowercase: true,
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
    bio: {
      type: String,
      default: "At School",
    },
    links: {
      type: Array,
    },

    location: {
      type: String,
    },
    post:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts",
      }
    ]

  },
  { timestamps: true },
);

export default mongoose.model<iSocialUserData>("users", userModel);