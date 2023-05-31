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
const prismaClient_1 = __importDefault(require("@core/database/prismaClient"));
const passport_local_1 = require("passport-local");
const bcrypt_util_1 = __importDefault(require("@utils/bcrypt.util"));
const ErrorTypes_1 = require("@core/types/ErrorTypes");
const initPassport = (passport) => {
    passport.use(new passport_local_1.Strategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
    }, function (req, username, password, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.isAdminLogin) {
                    const user = yield prismaClient_1.default.user.findFirst({
                        where: {
                            username,
                        },
                    });
                    if (!user) {
                        return done(null, false, { message: "Incorrect username." });
                    }
                    if (!user.password) {
                        return done(null, false, { message: "Incorrect username." });
                    }
                    const isSamePassword = yield bcrypt_util_1.default.comparePassword(password, user.password);
                    if (!isSamePassword) {
                        return done(null, false, {
                            message: "Incorrect password.",
                        });
                    }
                    return done(null, user, { message: "Login success" });
                }
            }
            catch (err) {
                return done(err);
            }
        });
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prismaClient_1.default.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                avatar: true,
                displayedName: true,
                username: true,
                email: true,
                role: true,
            },
        });
        if (user)
            done(null, user);
        else
            done(new ErrorTypes_1.UnAuthenticated(), null);
    }));
};
exports.default = initPassport;
