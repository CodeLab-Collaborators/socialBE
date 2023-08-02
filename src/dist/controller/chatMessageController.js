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
exports.readChatMessage = exports.createChatMessage = void 0;
const chatModel_1 = __importDefault(require("../model/chat/chatModel"));
const chatMessage_1 = __importDefault(require("../model/chat/chatMessage"));
const userModel_1 = __importDefault(require("../model/userModel"));
const createChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID, chatID } = req.params;
        const { message } = req.body;
        const chatExit = yield chatModel_1.default.findById(chatID);
        const userExit = yield userModel_1.default.findById(userID);
        console.log("chat: ", chatExit);
        console.log("user: ", userExit);
        if (chatExit && userExit) {
            const chatMessages = yield chatMessage_1.default.create({
                userID: userExit._id,
                chatID: chatExit._id,
                message,
            });
            return res.status(201).json({
                message: "chat message create",
                data: chatMessages,
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
exports.createChatMessage = createChatMessage;
const readChatMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatID } = req.params;
        const chatMessages = yield chatMessage_1.default
            .find({
            chatID,
        })
            .sort({ createdAt: -1 });
        return res.status(200).json({
            message: "viewing chat message",
            data: chatMessages,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.readChatMessage = readChatMessage;
