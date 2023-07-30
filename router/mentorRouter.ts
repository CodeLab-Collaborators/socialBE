import express from "express";
import { beMentored, unMentored } from "../controller/mentoController";

const router = express.Router();

router.route("/:userID/:friendID/be-mentored").post(beMentored);
router.route("/:userID/:friendID/un-mentored").post(unMentored);

export default router;
