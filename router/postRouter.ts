import express,{Router} from "express"
import { createPost, deleteUserPost, getSingleUserPost } from "../controller/userPost"

const router = Router()

router.route("/").get(getSingleUserPost);
router.route("/").post(createPost)
router.route("/:ID/delelepost").delete(deleteUserPost)


export default router