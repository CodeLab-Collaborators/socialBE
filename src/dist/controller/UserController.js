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
exports.refreshUserToken = exports.changePassword = exports.resetMail = exports.verifyUser = exports.signin = exports.createUser = exports.updateUserImage = exports.editProfile = exports.updateUser = exports.deleteUser = exports.getOneUser = exports.getUser = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../utils/email");
const userModel_1 = __importDefault(require("../model/userModel"));
const HTTP_1 = require("../constants/HTTP");
const errorDefiner_1 = require("../error/errorDefiner");
const streamifier_1 = __importDefault(require("streamifier"));
//getting all user 
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        return res.status(HTTP_1.HTTP.OK).json({
            message: `Viewing all ${users.length} users`,
            data: users,
        });
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to view user`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "view user Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Error Found",
            data: err,
        });
    }
});
exports.getUser = getUser;
//getting a single user
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield userModel_1.default.findById(id);
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Viewing user detail",
            data: user,
        });
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to view user`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "user detail Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Error Found",
            data: err,
        });
    }
});
exports.getOneUser = getOneUser;
//deleting a user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const removeUser = yield userModel_1.default.findByIdAndDelete(id);
        return res.status(HTTP_1.HTTP.OK).json({
            message: "user has been delete",
        });
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to create user`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "remoev user Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Error Found",
            data: err,
        });
    }
});
exports.deleteUser = deleteUser;
//editing the user profile
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userName, fullName, location, address, placeOfBirth, college, profession, secondarySchool, bio, } = req.body;
        const user = yield userModel_1.default.findByIdAndUpdate(id, {
            userName,
            fullName,
            location,
            address,
            placeOfBirth,
            college,
            profession,
            secondarySchool,
            bio,
        }, { new: true });
        return res.status(HTTP_1.HTTP.OK).json({
            message: "Updating user's info",
            data: user,
        });
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to update user`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "user update Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Error Found",
            data: err,
        });
    }
});
exports.updateUser = updateUser;
//editing the user profile
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(req.params.id, {
            $set: {
                userName: req.body
            }
        }, {
            new: true,
        });
        res.status(200).json({
            message: "Account has been updated",
            data: user,
        });
    }
    catch (error) {
        res.status(400).json({
            message: "an error occured while editing user profile",
        });
    }
});
exports.editProfile = editProfile;
//updating the user image 
const updateUserImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pixID = yield userModel_1.default.findById(req.params.id);
        console.log(pixID);
        if (pixID === null || pixID === void 0 ? void 0 : pixID.avatarID) {
            yield cloudinary_1.default.uploader.destroy(pixID.avatarID);
            let streamUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                    let stream = yield cloudinary_1.default.uploader.upload_stream((error, result) => {
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
            const viewUser = yield userModel_1.default.findByIdAndUpdate(req.params.id, {
                avatar: image.secure_url,
                avatarID: image.public_id,
            }, { new: true });
            res.status(200).json({
                message: "user data updated",
                data: viewUser,
            });
        }
        else {
            let streamUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
                return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                    let stream = yield cloudinary_1.default.uploader.upload_stream((error, result) => {
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
            const viewUser = yield userModel_1.default.findByIdAndUpdate(req.params.id, {
                avatar: image.secure_url,
                avatarID: image.public_id,
            }, { new: true });
            res.status(200).json({
                message: "user data updated",
                data: viewUser,
            });
        }
    }
    catch (error) {
        res.status(404).json({ message: error });
    }
});
exports.updateUserImage = updateUserImage;
//creating a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, userName, email, password } = req.body;
        const tokenData = crypto_1.default.randomBytes(16).toString("hex");
        console.log(tokenData);
        const checkIfExist = yield userModel_1.default.findOne({ email });
        if (checkIfExist) {
            return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                message: "This user does exist",
            });
        }
        else {
            if (!password) {
                new errorDefiner_1.mainAppErrorHandler({
                    message: `Please put in a password`,
                    status: HTTP_1.HTTP.BAD_REQUEST,
                    name: "No password Error",
                    isSuccess: false,
                });
                return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
                    message: "Please enter your choice password",
                });
            }
            else {
                const slt = yield bcrypt_1.default.genSalt(10);
                const hash = yield bcrypt_1.default.hash(password, slt);
                const user = yield userModel_1.default.create({
                    fullName,
                    userName,
                    email,
                    password: hash,
                    token: tokenData,
                    verified: false,
                });
                (0, email_1.verifiedUserMail)(user)
                    .then((result) => {
                    console.log("message been sent to you: ");
                })
                    .catch((error) => console.log(error));
                return res.status(HTTP_1.HTTP.CREATED).json({
                    message: "Please check your mail to verify your account",
                    data: user,
                });
            }
        }
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to create school for Admin`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "School creation Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Error Found",
            data: err,
        });
    }
});
exports.createUser = createUser;
//sign In
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const findUser = yield userModel_1.default.findOne({ email });
        if (!findUser) {
            return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                message: "This user does not exist",
            });
        }
        else {
            if (findUser.token === "" && findUser.verified === true) {
                const decryptPassword = yield bcrypt_1.default.compare(password, findUser === null || findUser === void 0 ? void 0 : findUser.password);
                if (decryptPassword) {
                    const encrypt = jsonwebtoken_1.default.sign({
                        id: findUser.id,
                    }, process.env.SIG_SECRET, { expiresIn: process.env.SIG_EXPIRES });
                    const refreshToken = jsonwebtoken_1.default.sign({
                        id: findUser.id,
                        email: findUser.email,
                        userName: findUser.userName,
                        verified: findUser.verified,
                    }, "veriedRefreshedUser", { expiresIn: "2m" });
                    return res.status(HTTP_1.HTTP.OK).json({
                        message: `Welcome back ${findUser.userName}`,
                        data: { encrypt },
                    });
                }
                else {
                    return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                        message: "Your password isn't correct",
                    });
                }
            }
            else {
                return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                    message: "This Account hasn't been Verified",
                });
            }
        }
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to create school for Admin`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "School creation Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Error Found",
            data: err,
        });
    }
});
exports.signin = signin;
//verifying a user
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, token } = req.params;
        const findUser = yield userModel_1.default.findById(id);
        console.log(findUser);
        if (!findUser) {
            return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                message: "This user does not exist",
            });
        }
        else {
            if (findUser.token !== "" && findUser.token === token) {
                const user = yield userModel_1.default.findByIdAndUpdate(id, {
                    token: "",
                    verified: true,
                }, { new: true });
                console.log("user: ", user);
                return res.status(HTTP_1.HTTP.OK).json({
                    message: "Your account has been verified, you can now sign in...!",
                    data: user,
                });
            }
            else {
                return res.status(HTTP_1.HTTP.ACCEPTED).json({ message: "done" });
            }
        }
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to create school for Admin`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "School creation Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Error Found",
            data: err,
        });
    }
});
exports.verifyUser = verifyUser;
//reset the user mail
const resetMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, token } = req.params;
        const { email } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                message: "This user does not exist",
            });
        }
        else {
            if (user.token === "" && user.verified === true) {
                const newToken = crypto_1.default.randomBytes(32).toString("hex");
                const userMail = yield userModel_1.default.findByIdAndUpdate(user._id, {
                    token: newToken,
                }, { new: true });
                (0, email_1.resetUserPassword)(userMail)
                    .then((result) => {
                    console.log("message been sent to you: ");
                })
                    .catch((error) => console.log(error));
                return res.status(HTTP_1.HTTP.OK).json({
                    message: "Please check your email to continue",
                    data: userMail,
                });
            }
            else {
                return res.status(HTTP_1.HTTP.BAD_REQUEST).json({ message: "Error" });
            }
        }
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to create school for Admin`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "School creation Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Error Found",
            data: err,
        });
    }
});
exports.resetMail = resetMail;
//Resting the user password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, token } = req.params;
        const { password } = req.body;
        const findUser = yield userModel_1.default.findById(id);
        if (!findUser) {
            return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                message: "This user does not exist",
            });
        }
        else {
            if (findUser.token !== "" && findUser.token === token) {
                const slt = yield bcrypt_1.default.genSalt(10);
                const hashed = yield bcrypt_1.default.hash(password, slt);
                const user = yield userModel_1.default.findByIdAndUpdate(findUser._id, {
                    password: hashed,
                    token: "",
                }, { new: true });
                return res.status(HTTP_1.HTTP.OK).json({
                    message: "Your password has been changed, you can now sign in",
                    data: user,
                });
            }
            else {
                return res.status(HTTP_1.HTTP.FORBIDDEN).json({
                    message: "Error",
                });
            }
        }
    }
    catch (err) {
        new errorDefiner_1.mainAppErrorHandler({
            message: `Unable to change Password`,
            status: HTTP_1.HTTP.BAD_REQUEST,
            name: "E Error",
            isSuccess: false,
        });
        return res.status(HTTP_1.HTTP.BAD_REQUEST).json({
            message: "Password error Found",
            data: err,
        });
    }
});
exports.changePassword = changePassword;
//Refreshing the user token
const refreshUserToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refresh } = req.body;
        jsonwebtoken_1.default.verify(refresh, process.env.REFRESH_SECRET, (err, payload) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    res.json({
                        message: "token session has expired",
                    });
                }
                else {
                    throw err;
                }
            }
            else {
                const encrypt = jsonwebtoken_1.default.sign({
                    id: payload.id,
                }, process.env.SIG_SECRET, { expiresIn: process.env.SIG_EXPIRES });
                const refreshToken = req.body.refresh;
                res.status(200).json({
                    message: "signin ",
                    data: { encrypt, refreshToken },
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.refreshUserToken = refreshUserToken;
