"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unLikeUserPosts = exports.likeUserPosts = exports.deleteUserPost = exports.createPost = exports.deleteUserPosts = exports.getSingleUserPost = exports.getUserPosts = exports.getAllPost = void 0;
const postModel_1 = __importDefault(require("../model/postModel"));
const HTTP_1 = require("../constants/HTTP");
const errorDefiner_1 = require("../error/errorDefiner");
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
//get all post
const getAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posting = yield postModel_1.default.find();
        return res.status(HTTP_1.HTTP.OK).json({
            message: `Gotten all ${posting.length} posts by users`,
            data: posting,
        });
    }
    catch (error) {
        new errorDefiner_1.mainAppErrorHandler({
            message: "Unable to get all post",
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "User posting error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Error found",
            data: error,
        });
    }
});
exports.getAllPost = getAllPost;
//get users' post
const getUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const posting = yield userModel_1.default.findById(userID).populate({
            path: "post",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: `Gotten all ${posting === null || posting === void 0 ? void 0 : posting.userName}'s posts`,
            data: posting,
        });
    }
    catch (error) {
        new errorDefiner_1.mainAppErrorHandler({
            message: "Unable to get all post",
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "User posting error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Error found",
            data: error,
        });
    }
});
exports.getUserPosts = getUserPosts;
//get all post 
const getSingleUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        //get authorization
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(HTTP_1.HTTP.OK).json({
                message: "Invalid Token",
            });
        }
        //decrypting the token
        const requestUser = jsonwebtoken_1.default.verify(token, "veriedRefreshedUser");
        //knowing who is the user
        const user = yield userModel_1.default.findOne({ email: requestUser.email });
        //getting the post of that particular user
        const posting = yield postModel_1.default.find({ user: user._id });
        return res.status(HTTP_1.HTTP.OK).json({
            message: `Gotten all ${posting.length} posts by ${user === null || user === void 0 ? void 0 : user.userName}`,
            data: posting,
        });
    }
    catch (error) {
        new errorDefiner_1.mainAppErrorHandler({
            message: "Unable to get all post",
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "User posting error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Error found",
            data: error,
        });
    }
});
exports.getSingleUserPost = getSingleUserPost;
//delete users' post
const deleteUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { userID, postID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            yield postModel_1.default.findByIdAndDelete(postID);
            (_b = user === null || user === void 0 ? void 0 : user.post) === null || _b === void 0 ? void 0 : _b.pull(new mongoose_1.default.Types.ObjectId(postID));
            user.save();
            return res.status(HTTP_1.HTTP.CREATED).json({
                message: `posts delete`,
            });
        }
        else {
            return res.status(HTTP_1.HTTP.OK).json({
                message: `You are not Authorized for This`,
            });
        }
    }
    catch (error) {
        new errorDefiner_1.mainAppErrorHandler({
            message: "Unable to get all post",
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "User posting error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Error found",
            data: error,
        });
    }
});
exports.deleteUserPosts = deleteUserPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const { userID } = req.params;
        //get authorization
        const token = (_c = req.headers.authorization) === null || _c === void 0 ? void 0 : _c.split(" ")[1];
        if (!token) {
            return res.status(HTTP_1.HTTP.OK).json({
                message: "Invalid Token",
            });
        }
        //decrypting the token
        const requestUser = jsonwebtoken_1.default.verify(token, "veriedRefreshedUser");
        //tie the post to the user
        const user = yield userModel_1.default.findById({ userID });
        if (!token) {
            return res.status(HTTP_1.HTTP.OK).json({
                message: "Invalid Token",
            });
        }
        const { post } = req.body;
        const whoPosted = yield userModel_1.default.findById(userID);
        if (whoPosted) {
            let streamUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                    let stream = cloudinary_1.default.uploader.upload_stream((error, result) => {
                        if (result) {
                            return resolve(result);
                        }
                        else {
                            return reject(error);
                        }
                    });
                    streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
                }));
            });
            const image = yield streamUpload(req);
            const creatingPost = yield postModel_1.default.create({
                post,
                mediaFile: image.secure_url,
                mediaFileID: image.public_id,
                userID: user._id,
                user: whoPosted,
            });
            (_d = whoPosted.post) === null || _d === void 0 ? void 0 : _d.push(new mongoose_1.default.Types.ObjectId(creatingPost._id));
            whoPosted.save();
            return res.status(HTTP_1.HTTP.CREATED).json({
                message: "your post has been created",
                data: creatingPost,
            });
        }
    }
    catch (error) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `unable to create a post`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "post craeting error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Error found",
            data: error,
        });
    }
});
exports.createPost = createPost;
const deleteUserPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    try {
        //get authorization
        const token = (_e = req.headers.authorization) === null || _e === void 0 ? void 0 : _e.split(" ")[1];
        if (!token) {
            return res.status(HTTP_1.HTTP.OK).json({
                message: "Invalid Token",
            });
        }
        //decrypting the token
        const requestUser = jsonwebtoken_1.default.verify(token, "veriedRefreshedUser");
        //knowing who is the user
        const user = yield userModel_1.default.findOne({ email: requestUser.email });
        const { ID } = req.params;
        const userPost = yield postModel_1.default.findById(ID);
        if ((user === null || user === void 0 ? void 0 : user._id) === userPost.user) {
            userPost === null || userPost === void 0 ? void 0 : userPost.deleteOne;
            (_f = user === null || user === void 0 ? void 0 : user.post) === null || _f === void 0 ? void 0 : _f.pull(new mongoose_1.default.Types.ObjectId(userPost === null || userPost === void 0 ? void 0 : userPost._id));
            user.save();
            return res.json(HTTP_1.HTTP.OK).json({
                message: "Your post have been  successfully deleted",
            });
        }
        else {
            return res.status(404).json({
                message: "this action is not allowed",
            });
        }
    }
    catch (error) {
        new errorDefiner_1.mainAppErrorHandler({
            message: "Unable to delete te user post",
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "remove post error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "An error occurred while deleting",
            data: error,
        });
    }
});
exports.deleteUserPost = deleteUserPost;
//like users' post
const likeUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, postID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const likePost = yield postModel_1.default.findById(postID);
            likePost === null || likePost === void 0 ? void 0 : likePost.like.push(userID);
            likePost === null || likePost === void 0 ? void 0 : likePost.save();
            return res.status(HTTP_1.HTTP.CREATED).json({
                message: `posts likeed by ${user === null || user === void 0 ? void 0 : user.userName}`,
            });
        }
        else {
            return res.status(HTTP_1.HTTP.OK).json({
                message: `You are not Authorized for This`,
            });
        }
    }
    catch (error) {
        new errorDefiner_1.mainAppErrorHandler({
            message: "Unable to get all post",
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "User posting error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Error found",
            data: error,
        });
    }
});
exports.likeUserPosts = likeUserPosts;
//unlike users' post
const unLikeUserPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, postID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const likePost = yield postModel_1.default.findById(postID);
            likePost === null || likePost === void 0 ? void 0 : likePost.like.pull(new mongoose_1.default.Types.ObjectId(userID));
            likePost === null || likePost === void 0 ? void 0 : likePost.save();
            return res.status(HTTP_1.HTTP.CREATED).json({
                message: `posts unliked by ${user === null || user === void 0 ? void 0 : user.userName}`,
                data: likePost,
            });
        }
        else {
            return res.status(HTTP_1.HTTP.OK).json({
                message: `You are not Authorized for This`,
            });
        }
    }
    catch (error) {
        new errorDefiner_1.mainAppErrorHandler({
            message: "Unable to get all post",
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "User posting error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Error found",
            data: error,
        });
    }
});
exports.unLikeUserPosts = unLikeUserPosts;
