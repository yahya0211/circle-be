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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileById = exports.getProfile = exports.updateProfile = void 0;
const profileServices = __importStar(require("../services/7-profileService"));
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const userId = res.locals.userId;
        const { body } = req;
        const files = req.files;
        let cover = undefined;
        let avatar = undefined;
        if (files) {
            cover = (_b = (_a = files.cover) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename;
            avatar = (_d = (_c = files.avatar) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filename;
        }
        if (cover)
            body.cover = cover;
        if (avatar)
            body.avatar = avatar;
        const dataUpdate = yield profileServices.updateProfile(userId, body);
        res.json({
            status: true,
            message: "Success",
            data: dataUpdate,
        });
    }
    catch (error) {
        const err = error;
        console.error("Error in updateProfile:", err.message);
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
});
exports.updateProfile = updateProfile;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = res.locals.userId;
        const profile = yield profileServices.getProfile(userId);
        res.json({
            status: true,
            message: "success",
            data: profile,
        });
    }
    catch (error) {
        const err = error;
        console.log(err);
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
});
exports.getProfile = getProfile;
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const profile = yield profileServices.getProfile(id);
        res.json({
            status: true,
            message: "success",
            data: profile,
        });
        return;
    }
    catch (error) {
        const err = error;
        console.log(err);
        res.status(500).json({
            status: false,
            message: err.message,
        });
    }
});
exports.getProfileById = getProfileById;
