import express,{Router} from "express"

import {
  createPost,
  deleteUserPosts,
  getAllPost,
  getUserPosts,
  likeUserPosts,
  unLikeUserPosts,
} from "../controller/userPost";
import multer from "multer";
let uploadData = multer();


const router = Router();


router.route("/get-posts").get(getAllPost);

router.route("/:userID/get-post").get(getUserPosts);

router.route("/:userID/:postID/delete-post").delete(deleteUserPosts);

router
  .route("/:userID/make-post")
  .post(uploadData.single("avatar"), createPost);

// like session
router.route("/:userID/:postID/unlike-post").post(unLikeUserPosts);

router.route("/:userID/:postID/like-post").post(likeUserPosts);

export default router