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
const RoleData_1 = require("@core/authenticate/RoleData");
const prismaClient_1 = __importDefault(require("@core/database/prismaClient"));
const bcrypt_util_1 = __importDefault(require("@utils/bcrypt.util"));
const imagekit_util_1 = __importDefault(require("@utils/imagekit.util"));
const lodash_1 = require("lodash");
const uuid_1 = require("uuid");
const crypto_1 = __importDefault(require("crypto"));
const emailClient_1 = __importDefault(require("@core/email/emailClient"));
const config_1 = __importDefault(require("@core/config"));
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        if (user && user.role === RoleData_1.ROLE.ADMIN) {
            const users = yield prismaClient_1.default.user.findMany({
                where: {
                    role: RoleData_1.ROLE.USER,
                },
                select: {
                    id: true,
                    displayedName: true,
                    email: true,
                    username: true,
                    joinday: true,
                    role: true,
                },
            });
            res.send(users);
        }
        else {
            res.send({
                error: {
                    message: "Yout not permit to see user infomation. Please login as admin.",
                },
            });
        }
    }
    catch (err) {
        res.send({ error: { message: String(err) } });
    }
});
const uploadAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        if (user) {
            let base64 = req.body.base64Image;
            let filename = (0, uuid_1.v4)();
            let rawData = base64.split(";base64,").pop();
            imagekit_util_1.default.upload(filename, rawData);
            prismaClient_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    avatar: filename,
                },
            });
            res.send({ message: "Update avatar successfull!" });
        }
        else {
            res.send({
                error: {
                    message: "Yout not permit to see user infomation. Please login as admin.",
                },
            });
        }
    }
    catch (err) {
        res.send({ error: { message: String(err) } });
    }
});
const changeNickName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        if (user) {
            let newNickname = req.body.newNickname;
            prismaClient_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    displayedName: newNickname,
                },
            });
            res.send({ message: "Update nickname successfull!" });
        }
        else {
            res.send({
                error: {
                    message: "Yout not permit to see user infomation. Please login as admin.",
                },
            });
        }
    }
    catch (err) {
        res.send({ error: { message: String(err) } });
    }
});
const getLikedMusics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        if (user) {
            const musics = yield prismaClient_1.default.music.findMany({
                where: {
                    likes: {
                        some: {
                            userid: user.id,
                        },
                    },
                },
            });
            res.send(musics);
        }
        else {
            res.send({ error: { message: "Not login yet." } });
        }
    }
    catch (err) {
        res.send({ error: { message: String(err) } });
    }
});
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let id = req.params.id;
    try {
        if (!user || (0, lodash_1.toInteger)(user.id) !== (0, lodash_1.toInteger)(id))
            throw res.send({
                error: { message: "You cannot see user info who is not you." },
            });
        else {
            const userInfo = yield prismaClient_1.default.music.findFirst({
                where: {
                    id: user.id,
                },
            });
            res.send(userInfo);
        }
    }
    catch (err) {
        res.send({ error: { message: String(err) } });
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { selector, password, currentpassword, newpassword } = req.body || {};
    const user = req.user;
    if (selector) {
        //For reset for forget password
        let resultEmail;
        const resetPasswordTarget = yield prismaClient_1.default.resetPassword.findFirst({
            where: {
                selector,
            },
        });
        if (!resetPasswordTarget) {
            res.send({ error: { message: "Something error!" } });
            return;
        }
        let hashedPassword = yield bcrypt_util_1.default.generateHash(password);
        yield prismaClient_1.default.user.update({
            where: {
                email: resetPasswordTarget.useremail,
            },
            data: {
                password: hashedPassword,
            },
        });
        yield prismaClient_1.default.resetPassword.delete({
            where: {
                id: resetPasswordTarget.id,
            },
        });
        res.send({ message: "Update password successfull." });
        return;
    }
    else if (user) {
        const userInfo = yield prismaClient_1.default.user.findFirst({
            where: {
                id: user.id,
            },
        });
        if (!userInfo) {
            res.send({ error: { message: "User not found" } });
            return;
        }
        const isSamePassword = yield bcrypt_util_1.default.comparePassword(currentpassword, userInfo === null || userInfo === void 0 ? void 0 : userInfo.password);
        if (!isSamePassword) {
            res.send({ error: { message: "Password not same" } });
            return;
        }
        const hashedNewPassword = yield bcrypt_util_1.default.generateHash(newpassword);
        yield prismaClient_1.default.user.update({
            where: {
                id: userInfo.id,
            },
            data: {
                password: hashedNewPassword,
            },
        });
        res.send({ message: "Update password successfully" });
    }
    else {
        res.send({ error: { message: "You not permit to perform this action." } });
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body || {};
    const userInfo = yield prismaClient_1.default.user.findFirst({
        where: {
            OR: [
                {
                    username,
                },
                {
                    email: username,
                },
            ],
        },
    });
    if (!userInfo) {
        res.send({ error: { message: "User not found" } });
        return;
    }
    let token = crypto_1.default.randomBytes(20).toString("hex");
    let selector = crypto_1.default.randomBytes(9).toString("hex");
    const EXPIRES_IN = 600000; //5 minutes afterward
    let expires = new Date().valueOf() + EXPIRES_IN;
    let hashToken = yield bcrypt_util_1.default.generateHash(token);
    yield prismaClient_1.default.resetPassword.create({
        data: {
            expires: expires,
            token: hashToken,
            selector,
            useremail: userInfo.email,
        },
    });
    emailClient_1.default.send({
        from: { email: config_1.default.SENDER_EMAIL, name: "Tien Hoang" },
        to: [{ email: userInfo.email, name: "User" }],
        subject: "Reset Password",
        html: `<h1>Reset Password For SE447-E Music App</h1>` +
            `<h1><a href='http://${req.hostname}/resetpassword?sel=${selector}&token=${token}'>Click here to reset password.</a></h1>`,
    });
    res.send({ message: "Check email for reset password." });
});
const authenticateResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sel, userToken } = req.body || {};
        let hexRegex = /^[0-9a-fA-F]+$/;
        if (hexRegex.test(sel) && hexRegex.test(userToken)) {
            const resetPassword = yield prismaClient_1.default.resetPassword.findFirst({
                where: {
                    selector: sel,
                    expires: {
                        gt: new Date().valueOf(),
                    },
                },
            });
            if (!resetPassword) {
                res.send({ error: { message: "Token was expires!" } });
                return;
            }
            let hashedUserToken = resetPassword.token;
            if (yield bcrypt_util_1.default.comparePassword(userToken, hashedUserToken)) {
                res.send({
                    isAuth: true,
                    message: "Request Reset password success!",
                });
            }
            else {
                res.send({ error: { message: "Token is invalid." } });
            }
        }
        else {
            res.send({ error: { message: "Token is invalid!" } });
        }
    }
    catch (err) {
        res.send({ error: { message: String(err) } });
    }
});
exports.default = {
    getUsers,
    uploadAvatar,
    changeNickName,
    getLikedMusics,
    getUserById,
    changePassword,
    authenticateResetPassword,
    resetPassword,
};
