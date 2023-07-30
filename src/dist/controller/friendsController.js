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
exports.unFriend = exports.beFriend = void 0;
const userModel_1 = __importDefault(require("../model/userModel"));
const beFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { userID, friendID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const friend = yield userModel_1.default.findById(friendID);
        if (friend) {
            (_a = user === null || user === void 0 ? void 0 : user.friends) === null || _a === void 0 ? void 0 : _a.push(friendID);
            user === null || user === void 0 ? void 0 : user.save();
            (_b = friend === null || friend === void 0 ? void 0 : friend.friends) === null || _b === void 0 ? void 0 : _b.push(userID);
            friend === null || friend === void 0 ? void 0 : friend.save();
            return res.status(200).json({
                message: "You're now both Friends",
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
exports.beFriend = beFriend;
const unFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    try {
        const { userID, friendID } = req.params;
        const user = yield userModel_1.default.findById(userID);
        const friend = yield userModel_1.default.findById(friendID);
        if (user && friend) {
            const checkUser = (_c = user.friends) === null || _c === void 0 ? void 0 : _c.some((el) => el === friendID);
            const checkFriend = (_d = friend.friends) === null || _d === void 0 ? void 0 : _d.some((el) => el === userID);
            if (checkUser) {
                (_e = user.friends) === null || _e === void 0 ? void 0 : _e.pull(friendID);
                user.save();
            }
            if (checkFriend) {
                (_f = friend.friends) === null || _f === void 0 ? void 0 : _f.pull(userID);
                friend.save();
            }
            return res.status(200).json({
                message: "You're both no more Friends",
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
exports.unFriend = unFriend;
