import mongoose,{Schema,Document} from "mongoose";
import { IpostData } from "../utils/interfaces/userInterface";

interface Ipost extends IpostData, Document{}

const postModel = new mongoose.Schema<IpostData>({
  tittle: {
    type: String,
  },
  content: {
    type: String,
  },
  mediaFile: {
    type: String,
  },
  user: 
    {
    type: Schema.Types.ObjectId,
    ref: "users",
  }
,
  hashtag:[
    {
        type:Schema.Types.ObjectId,
        ref:"users"
    }
  ]
});

export default mongoose.model<Ipost>("posts", postModel);


