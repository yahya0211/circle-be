"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const threadRouter_1 = __importDefault(require("./threadRouter"));
const followRouter_1 = __importDefault(require("./followRouter"));
const replyRouter_1 = __importDefault(require("./replyRouter"));
const likeRouter_1 = __importDefault(require("./likeRouter"));
const profileRouter_1 = __importDefault(require("./profileRouter"));
const indexRouter = (0, express_1.Router)();
indexRouter.use("/api/user", userRouter_1.default);
indexRouter.use("/api/auth", authRouter_1.default);
indexRouter.use("/api/threads", threadRouter_1.default);
indexRouter.use("/api/follow", followRouter_1.default);
indexRouter.use("/api/reply", replyRouter_1.default);
indexRouter.use("/api/like", likeRouter_1.default);
indexRouter.use("/api/profile", profileRouter_1.default);
exports.default = indexRouter;
