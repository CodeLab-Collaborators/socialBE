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
exports.createPost = exports.getAllPost = void 0;
const postModel_1 = __importDefault(require("../model/postModel"));
const HTTP_1 = require("../constants/HTTP");
const errorDefiner_1 = require("../error/errorDefiner");
//get all post 
const getAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posting = yield postModel_1.default.find();
        return res.status(HTTP_1.HTTP.OK).json({
            message: `Gotten all ${posting.length} posts by users`,
            data: posting
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
            data: error
        });
    }
});
exports.getAllPost = getAllPost;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tittle, content, mediaFile } = req.body;
        if (!req.body) {
            return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                message: "This post can not be created",
            });
        }
        else {
            const creatingPosting = yield postModel_1.default.create({
                tittle,
                content,
                mediaFile,
            });
            return res.status(HTTP_1.HTTP.CREATED).json({
                message: "your post has been created",
                data: creatingPosting
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
            data: error
        });
    }
});
exports.createPost = createPost;
