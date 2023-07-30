import mongoose from "mongoose";
import { iChatMessage } from "../../utils/interfaces/userInterface";

export interface iChatMessageData extends iChatMessage, mongoose.Document {}

const chatMessageModel = new mongoose.Schema(
  {
    userID: {
      type: String,
    },
    chatID: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model<iChatMessageData>(
  "chatMessages",
  chatMessageModel,
);
