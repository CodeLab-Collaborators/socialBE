import mongoose,{Schema,Document} from "mongoose";
import { IpostData } from "../utils/interfaces/userInterface";

interface Ipost extends IpostData, Document{}

const postModel = new mongoose.Schema<IpostData>({
  post: {
    type: String,
  },
  userID: {
    type: String,
  },

  mediaFile: {
    type: String,
  },
  mediaFileID: {
    type: String,
  },
  like: {
    type: [],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  hashtag: [
    {
      type: Schema.Types.ObjectId,
      ref: "hashTags",
    },
  ],
});

export default mongoose.model<Ipost>("posts", postModel);


