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
exports.getSpecificChat = exports.getChat = exports.unChatFriend = exports.createChat = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const chatModel_1 = __importDefault(require("../model/chat/chatModel"));
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userID, friendID } = req.params;
        const userFriends = yield userModel_1.default.findById(userID).populate({
            path: "friends",
        });
        const findFriends = (_a = userFriends === null || userFriends === void 0 ? void 0 : userFriends.friends) === null || _a === void 0 ? void 0 : _a.find((el) => {
            return el === friendID;
        });
        if (findFriends) {
            const chat = yield chatModel_1.default.create({
                member: [userID, friendID],
            });
            return res.status(201).json({
                message: "create chat",
                data: chat,
            });
        }
        else {
            return res.status(404).json({
                message: "Should be a friend first",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.createChat = createChat;
const unChatFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, friendID, chatID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const friend = yield userModel_1.default.findById(friendID);
        if (user && friend) {
            const deleteChat = yield chatModel_1.default.findByIdAndDelete(chatID);
            return res.status(200).json({
                message: "chat has been removed from youe collections",
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
exports.unChatFriend = unChatFriend;
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const getChatt = yield chatModel_1.default.find({
            member: {
                $in: [userID],
            },
        });
        return res.status(200).json({
            message: "getting chats",
            data: getChatt,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.getChat = getChat;
const getSpecificChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, friendID } = req.params;
        const chatt = yield chatModel_1.default.findOne({
            member: {
                $all: [userID, friendID],
            },
        });
        return res.status(200).json({
            message: "getting chats",
            data: chatt,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.getSpecificChat = getSpecificChat;
