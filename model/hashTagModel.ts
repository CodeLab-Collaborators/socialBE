import mongoose, { Schema, Document } from "mongoose";
import { iHash } from "../utils/interfaces/userInterface";

interface iHashTag extends iHash, Document {}

const hashTagModel = new mongoose.Schema<iHash>({
  title: {
    type: String,
  },

  userID: {
    type: String,
  },

  user: {},

  post: {
    type: Schema.Types.ObjectId,
    ref: "posts",
  },
});

export default mongoose.model<iHashTag>("hashTags", hashTagModel);
