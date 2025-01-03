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
exports.deleteReply = exports.findReply = exports.getAllReply = exports.insertReply = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const cloudinaryConfig_1 = __importDefault(require("../middleware/cloudinaryConfig"));
const fs = __importStar(require("fs"));
const insertReply = (threadId, body, files, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const thisThread = yield db_1.default.thread.findUnique({
        where: {
            id: threadId,
        },
    });
    if (!thisThread) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    let image_url = [];
    if (Array.isArray(files.image)) {
        for (const file of files.image) {
            const result = yield cloudinaryConfig_1.default.uploader.upload(file.path, {
                folder: "Circle53",
            });
            image_url.push(result.secure_url);
            fs.unlinkSync(file.path);
        }
    }
    const replies = yield db_1.default.thread.create({
        data: {
            content: body.content,
            userId: userId,
            threadId: threadId,
        },
    });
    yield db_1.default.threadImage.createMany({
        data: image_url.map((img) => ({
            url: img,
            threadId: replies.id,
        })),
    });
    return replies;
});
exports.insertReply = insertReply;
const getAllReply = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.thread.findMany();
});
exports.getAllReply = getAllReply;
const findReply = (idThread) => __awaiter(void 0, void 0, void 0, function* () {
    const replies = yield db_1.default.thread.findFirst({
        where: {
            id: idThread,
        },
        include: {
            author: {
                select: {
                    id: true,
                    fullname: true,
                },
            },
            replies: {
                include: {
                    author: {
                        select: {
                            id: true,
                            fullname: true,
                        },
                    },
                },
            },
            image: {
                select: {
                    url: true,
                },
            },
        },
    });
    if (!replies) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    return replies;
});
exports.findReply = findReply;
const deleteReply = (threadId, idReply) => __awaiter(void 0, void 0, void 0, function* () {
    const findThread = yield db_1.default.thread.findFirst({
        where: {
            id: threadId
        }
    });
    if (!findThread) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    yield db_1.default.threadImage.deleteMany({
        where: {
            threadId: idReply,
        },
    });
    const deletedReply = yield db_1.default.thread.delete({
        where: {
            id: idReply,
        },
    });
    return `success delete reply with id ${deletedReply.id}`;
});
exports.deleteReply = deleteReply;
