"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userPost_1 = require("../controller/userPost");
const multer_1 = __importDefault(require("multer"));
let uploadData = (0, multer_1.default)();
const router = (0, express_1.Router)();
router.route("/get-posts").get(userPost_1.getAllPost);
router.route("/:userID/get-post").get(userPost_1.getUserPosts);
router.route("/:userID/get-friends-post").get(userPost_1.getUserFriendPosts);
router.route("/:userID/:postID/delete-post").delete(userPost_1.deleteUserPosts);
router
    .route("/:userID/make-post")
    .post(uploadData.single("avatar"), userPost_1.createPost);
// like session
router.route("/:userID/:postID/unlike-post").post(userPost_1.unLikeUserPosts);
router.route("/:userID/:postID/like-post").post(userPost_1.likeUserPosts);
exports.default = router;
