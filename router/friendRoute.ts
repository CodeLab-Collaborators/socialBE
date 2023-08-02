import express from "express";
import { beFriend, unFriend } from "../controller/friendsController";

const router = express.Router();

router.route("/:userID/:friendID/be-friend").post(beFriend);
router.route("/:userID/:friendID/un-friend").post(unFriend);

export default router;
