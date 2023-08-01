import express from "express";
import { beLike, unLike } from "../controller/likeController";

const router = express.Router();

router.route("/:userID/:postID/be-like").post(beLike);
router.route("/:userID/:postID/un-like").post(unLike);

export default router;
