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
const authService = __importStar(require("../services/2-authService"));
const errorHandler_1 = require("../utils/errorHandler");
const email_1 = __importDefault(require("../middleware/email"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataRegister = yield authService.register(req.body);
        res.status(200).json(dataRegister);
    }
    catch (error) {
        console.log(error);
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataLogin = yield authService.login(req.body);
        res.status(200).json(dataLogin);
    }
    catch (error) {
        console.log(error);
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.login = login;
const forgotPaassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataForgotPassword = yield authService.forgotPaassword(req.body.email);
        const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${dataForgotPassword.resetToken}`;
        const message = `We confirm that you have requested a password reset. Please click the following link: \n\n${resetUrl}\n\nIf you did not request a password reset, please ignore this email.`;
        yield (0, email_1.default)({ email: req.body.email, subject: "Password Reset", message });
        res.status(200).json(dataForgotPassword);
    }
    catch (error) {
        console.log(error);
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.forgotPaassword = forgotPaassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataResetPassword = yield authService.resetPassword(req.params.resetToken, req.body.newPassword);
        res.status(200).json(dataResetPassword);
    }
    catch (error) {
        console.log(error);
        return (0, errorHandler_1.errorHandler)(error, res);
    }
});
exports.resetPassword = resetPassword;
