"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const followController_1 = require("../controller/followController");
const router = express_1.default.Router();
router.route("/:userID/:friendID/be-followed").post(followController_1.beFollowed);
router.route("/:userID/:friendID/un-followed").post(followController_1.unFollowed);
exports.default = router;
