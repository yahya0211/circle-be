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
exports.createLike = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const createLike = (idThread, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const thisThread = yield db_1.default.thread.findFirst({
        where: {
            id: idThread,
        },
    });
    if (!thisThread) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    const existLike = yield db_1.default.like.findFirst({
        where: {
            userId: userId,
            threadId: idThread,
        },
    });
    if (existLike) {
        yield db_1.default.like.deleteMany({
            where: {
                userId: userId,
                threadId: idThread,
            },
        });
        return `Success unlike idThread with id ${idThread}`;
    }
    else {
        yield db_1.default.like.create({
            data: {
                userId: userId,
                threadId: idThread,
            },
        });
        return `Success like idThread with id ${idThread}`;
    }
});
exports.createLike = createLike;
