import express,{Router} from "express"
import { getAllPost } from "../controller/userPost"

const router = Router()

router.route("/allpost").get(getAllPost);
router