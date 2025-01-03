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
exports.updateThread = exports.deleteThread = exports.getThreads = exports.getThread = exports.insertThread = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const cloudinaryConfig_1 = __importDefault(require("../middleware/cloudinaryConfig"));
const fs = __importStar(require("fs"));
const insertThread = (body, files) => __awaiter(void 0, void 0, void 0, function* () {
    const image_url = [];
    if (files && Array.isArray(files.image)) {
        for (const file of files.image) {
            const result = yield cloudinaryConfig_1.default.uploader.upload(file.path, {
                folder: "Circle53",
            });
            image_url.push(result.secure_url);
            fs.unlinkSync(file.path);
        }
    }
    const thread = yield db_1.default.thread.create({
        data: {
            content: body.content,
            userId: body.userId,
            image: {
                create: image_url.map((url) => ({ url })),
            },
        },
        include: {
            image: true,
        },
    });
    return thread;
});
exports.insertThread = insertThread;
const getThread = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const thread = yield db_1.default.thread.findFirst({
        where: {
            id,
        },
        include: {
            author: {
                select: {
                    id: true,
                    fullname: true,
                },
            },
            image: {
                select: {
                    url: true,
                },
            },
        },
    });
    if (!thread) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    return thread;
});
exports.getThread = getThread;
const getThreads = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield db_1.default.thread.findMany({
        where: {
            threadId: null,
        },
        include: {
            author: {
                select: {
                    id: true,
                    fullname: true,
                },
            },
            image: {
                select: {
                    url: true,
                },
            },
            replies: true,
        },
        orderBy: {
            id: "desc",
        },
    });
});
exports.getThreads = getThreads;
const deleteThread = (idThread, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existedThread = yield db_1.default.thread.findFirst({
        where: {
            id: idThread,
        },
        include: {
            image: true,
        },
    });
    if (!existedThread) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    if (existedThread.userId !== userId) {
        throw new Error("You cannot allow to delete this thread");
    }
    yield db_1.default.threadImage.deleteMany({
        where: {
            threadId: idThread,
        },
    });
    yield db_1.default.thread.deleteMany({
        where: {
            id: idThread,
        },
    });
    return { existedThread };
});
exports.deleteThread = deleteThread;
const updateThread = (idThread, files, content, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the thread exists
    const existedThread = yield db_1.default.thread.findFirst({
        where: {
            id: idThread,
        },
    });
    if (!existedThread) {
        throw new Error("Thread not found!");
    }
    if (existedThread.userId !== userId) {
        throw new Error("You cannot allow to update this thread");
    }
    const image_url = [];
    // Process new image uploads if provided
    if (files.image && Array.isArray(files.image)) {
        for (const file of files.image) {
            const result = yield cloudinaryConfig_1.default.uploader.upload(file.path, {
                folder: "Circle53",
            });
            image_url.push(result.secure_url);
            fs.unlinkSync(file.path); // Remove local file after upload
        }
    }
    // Ensure content is defined or use fallback (existed content)
    const updatedContent = content || (existedThread === null || existedThread === void 0 ? void 0 : existedThread.content);
    // Update the thread with optional new images
    const updatedThread = yield db_1.default.thread.update({
        where: {
            id: idThread,
        },
        data: {
            content: updatedContent, // Use updated content or existing content
            image: image_url.length > 0
                ? {
                    create: image_url.map((url) => ({ url })), // Add new images
                }
                : undefined, // Don't modify images if no new ones are provided
        },
        include: {
            image: true,
        },
    });
    return {
        existedThread: updatedThread,
        image_url: updatedThread.image.map((image) => {
            return image.url;
        }),
    };
});
exports.updateThread = updateThread;
