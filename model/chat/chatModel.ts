import mongoose from "mongoose";
import { iChat } from "../../utils/interfaces/userInterface";

export interface iChatData extends iChat, mongoose.Document {}

const chatModel = new mongoose.Schema(
  {
    member: {
      type: Array<String>,
    },
  },
  { timestamps: true },
);

export default mongoose.model<iChatData>("chats", chatModel);
