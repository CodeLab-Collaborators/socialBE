import express from "express";
import { beFollowed, unFollowed } from "../controller/followController";

const router = express.Router();

router.route("/:userID/:friendID/be-followed").post(beFollowed);
router.route("/:userID/:friendID/un-followed").post(unFollowed);

export default router;
