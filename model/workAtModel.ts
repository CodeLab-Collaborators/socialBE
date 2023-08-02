import mongoose, { Schema, Document } from "mongoose";
import { iWork } from "../utils/interfaces/userInterface";

interface iWorkData extends iWork, Document {}

const workAtModel = new mongoose.Schema<iWork>(
  {
    workPlace: {
      type: String,
    },

    workLocation: {
      type: String,
    },

    startedAt: {
      type: String,
    },

    endsAt: {
      type: String,
    },

    userID: {
      type: String,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<iWorkData>("works", workAtModel);
