"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.resetPassword = exports.forgotPaassword = exports.login = exports.register = void 0;
const userService = __importStar(require("./1-userServices"));
const db_1 = __importDefault(require("../lib/db"));
const authSchema_1 = __importDefault(require("../lib/validation/authSchema"));
const error_1 = require("../utils/constant/error");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authSchema_2 = __importDefault(require("../lib/validation/authSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = authSchema_1.default.registerSchema.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }
    if (!value.password || typeof value.password !== "string") {
        throw new Error("Password is required and must be a string.");
    }
    const isExist = yield db_1.default.user.findFirst({
        where: {
            OR: [{ username: value.username }, { email: value.email }],
        },
    });
    if (isExist) {
        throw new Error("USER_IS_EXIST");
    }
    const hashedPassword = yield bcrypt_1.default.hash(value.password, 10);
    value.password = hashedPassword;
    const user = yield db_1.default.user.create({
        data: Object.assign({}, value),
    });
    const profile = yield db_1.default.profile.create({
        data: { userId: user.id },
    });
    return { user, profile };
});
exports.register = register;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. validate input
    const { error, value } = authSchema_2.default.loginSchema.validate(body);
    if (error === null || error === void 0 ? void 0 : error.details) {
        console.log(error);
        throw new Error(error_1.ERROR_MESSAGE.WRONG_INPUT);
    }
    // 2. check existing email
    const existEmail = yield userService.getSingleUser({
        email: value.email,
    });
    if (!existEmail) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    // 3. check password
    const isMatch = yield bcrypt_1.default.compare(value.password, existEmail.password);
    if (!isMatch) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    const token = jsonwebtoken_1.default.sign(existEmail, process.env.SECRET_KEY, {
        expiresIn: "1d",
    });
    return { token };
});
exports.login = login;
const forgotPaassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const findEmail = yield db_1.default.user.findFirst({
        where: {
            email,
        },
    });
    if (!findEmail) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expireToken = new Date(Date.now() + 60 * 60 * 1000);
    const passwordReset = yield db_1.default.resetPassword.create({
        data: {
            tokenPassword: resetToken,
            passwordResetToken,
            userId: findEmail.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            expiresAt: expireToken,
        },
    });
    return { resetToken, passwordResetToken, passwordReset };
});
exports.forgotPaassword = forgotPaassword;
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (!newPassword || typeof newPassword !== "string") {
        throw new Error("New password is required and must be a string.");
    }
    const tokenReset = token;
    const resetRecord = yield db_1.default.resetPassword.findFirst({
        where: {
            tokenPassword: tokenReset,
            expiresAt: { gt: new Date() },
        },
    });
    if (!resetRecord) {
        throw new Error("Invalid or expired reset token.");
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    const passwordUpdate = yield db_1.default.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
        include: { resetPassword: true },
    });
    yield db_1.default.resetPassword.delete({
        where: { id: resetRecord.id },
    });
    return { passwordUpdate };
});
exports.resetPassword = resetPassword;
