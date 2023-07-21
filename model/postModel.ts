import mongoose,{Schema,Document} from "mongoose";
import { IpostData } from "../utils/interfaces/userInterface";

interface Ipost extends IpostData, Document{}

const postModel = new mongoose.Schema<IpostData>({
  user: 
    {
        type:Schema.Types.ObjectId,
        ref:"users",

    },
    tittle:{
        type:String,
    },
    content:{
        type:String,
    },
    mediaFile:{
        type:String,
    }
  
});

export default mongoose.model<Ipost>("posts", postModel);


