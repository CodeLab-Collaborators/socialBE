"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userPost_1 = require("../controller/userPost");
const router = (0, express_1.Router)();
router.route("/allpost").get(userPost_1.getAllPost);
router;
