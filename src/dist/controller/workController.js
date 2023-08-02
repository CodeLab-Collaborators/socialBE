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
exports.endAWorkInfo = exports.terminateUserWork = exports.getUserWorkHistory = exports.createNewWork = void 0;
const HTTP_1 = require("../constants/HTTP");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../model/userModel"));
const workAtModel_1 = __importDefault(require("../model/workAtModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorDefiner_1 = require("../error/errorDefiner");
const createNewWork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userID } = req.params;
        //get authorization
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(HTTP_1.HTTP.OK).json({
                message: "Invalid Token",
            });
        }
        //decrypting the token
        const requestUser = jsonwebtoken_1.default.verify(token, "veriedRefreshedUser");
        //tie the post to the user
        if (!token) {
            return res.status(HTTP_1.HTTP.OK).json({
                message: "Invalid Token",
            });
        }
        const { workPlace, workLocation, startedAt, endsAt } = req.body;
        const user = yield userModel_1.default.findById(userID);
        if (user) {
            const work = yield workAtModel_1.default.create({
                workPlace,
                workLocation,
                startedAt,
                endsAt,
                userID: user._id,
                user,
            });
            (_b = user.workAt) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(work._id));
            user.save();
            return res.status(HTTP_1.HTTP.CREATED).json({
                message: "your post has been created",
                data: work,
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
exports.createNewWork = createNewWork;
//get users' work info
const getUserWorkHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const workInfo = yield userModel_1.default.findById(userID).populate({
            path: "work",
            options: {
                sort: {
                    createdAt: -1,
                },
            },
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: `Gotten all ${workInfo === null || workInfo === void 0 ? void 0 : workInfo.userName}'s work history`,
            data: workInfo,
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
exports.getUserWorkHistory = getUserWorkHistory;
//get users' work terminate
const terminateUserWork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, workID } = req.params;
        const userInfo = yield userModel_1.default.findById(userID);
        const workInfo = yield workAtModel_1.default.findByIdAndDelete(workID);
        userInfo === null || userInfo === void 0 ? void 0 : userInfo.workAt.pull(new mongoose_1.default.Types.ObjectId(workID));
        userInfo === null || userInfo === void 0 ? void 0 : userInfo.save();
        return res.status(HTTP_1.HTTP.OK).json({
            message: `Gotten all ${userInfo === null || userInfo === void 0 ? void 0 : userInfo.userName}'s work history`,
            data: workInfo,
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
exports.terminateUserWork = terminateUserWork;
//get users' work ends
const endAWorkInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, workID } = req.params;
        const userInfo = yield userModel_1.default.findById(userID);
        if (userInfo) {
            const workInfo = yield workAtModel_1.default.findByIdAndUpdate(workID, {
                endsAt: Date.now(),
            }, { new: true });
            return res.status(HTTP_1.HTTP.OK).json({
                message: `Ends ${userInfo === null || userInfo === void 0 ? void 0 : userInfo.userName}'s work journey with ${workInfo === null || workInfo === void 0 ? void 0 : workInfo.workPlace}`,
                data: workInfo,
            });
        }
        else {
            return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
                message: "User not Authozied",
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
exports.endAWorkInfo = endAWorkInfo;
