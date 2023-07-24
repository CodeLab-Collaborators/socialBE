"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    userName: {
        type: String,
        unique: [true, "username already exist"],
    },
    fullName: {
        type: String,
    },
    location: {
        type: String,
    },
    profession: {
        type: String,
    },
    placeOfBirth: {
        type: String,
    },
    secondarySchool: {
        type: String,
    },
    college: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        trim: false,
        lowercase: true,
    },
    password: {
        type: String,
    },
    token: {
        type: String,
    },
    avatar: {
        type: String,
    },
    avatarID: {
        type: String,
    },
    verified: {
        type: Boolean,
    },
    bio: {
        type: String,
        default: "At School",
    },
    links: {
        type: Array,
    },
    primarySchool: {
        type: String,
    },
    music: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
        }
    ],
    church: {
        type: String
    },
    mosque: {
        type: String
    },
    post: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "posts",
        }
    ]
}, { timestamps: true });
exports.default = mongoose_1.default.model("users", userModel);
