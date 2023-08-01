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
exports.unLike = exports.beLike = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const postModel_1 = __importDefault(require("../model/postModel"));
const beLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userID, postID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const post = yield postModel_1.default.findById(postID);
        if (user && post) {
            (_a = post === null || post === void 0 ? void 0 : post.like) === null || _a === void 0 ? void 0 : _a.push(userID);
            post === null || post === void 0 ? void 0 : post.save();
            return res.status(200).json({
                message: "Your like has been recorded ",
            });
        }
        else {
            return res.status(404).json({
                message: "Something isn't right",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.beLike = beLike;
const unLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const { userID, postID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const post = yield postModel_1.default.findById(postID);
        if (user && post) {
            const checkPost = (_b = post.like) === null || _b === void 0 ? void 0 : _b.some((el) => el === userID);
            if (checkPost) {
                (_c = post.like) === null || _c === void 0 ? void 0 : _c.pull(userID);
                post.save();
            }
            return res.status(200).json({
                message: "You have unlike this post",
            });
        }
        else {
            return res.status(404).json({
                message: "Something isn't right",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.unLike = unLike;
