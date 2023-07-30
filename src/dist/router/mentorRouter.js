"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mentoController_1 = require("../controller/mentoController");
const router = express_1.default.Router();
router.route("/:userID/:friendID/be-mentored").post(mentoController_1.beMentored);
router.route("/:userID/:friendID/un-mentored").post(mentoController_1.unMentored);
exports.default = router;
