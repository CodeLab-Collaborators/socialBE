import express,{Router} from "express"
import { createPost, getAllPost } from "../controller/userPost"

const router = Router()

router.route("/").get(getAllPost);
router.route("/").post(createPost)

export default router