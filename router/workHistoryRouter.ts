import express from "express";
import {
  createNewWork,
  getUserWorkHistory,
  terminateUserWork,
  endAWorkInfo,
} from "../controller/workController";

const router = express.Router();

router.route("/:userID/new-work").post(createNewWork);
router.route("/:userID/get-work-history").get(getUserWorkHistory);
router.route("/:userID/:workID/terminate-a-work").delete(terminateUserWork);
router.route("/:userID/:workID/end-a-work-journey").patch(endAWorkInfo);

export default router;
