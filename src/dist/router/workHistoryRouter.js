"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workController_1 = require("../controller/workController");
const router = express_1.default.Router();
router.route("/:userID/new-work").post(workController_1.createNewWork);
router.route("/:userID/get-work-history").get(workController_1.getUserWorkHistory);
router.route("/:userID/:workID/terminate-a-work").delete(workController_1.terminateUserWork);
router.route("/:userID/:workID/end-a-work-journey").patch(workController_1.endAWorkInfo);
exports.default = router;
