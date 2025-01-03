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
exports.getAllUser = exports.getUsernameProfile = exports.getSingleUser = exports.updateUserV2 = exports.updateUser = exports.deleteUser = exports.insertUser = exports.getUser = void 0;
const db_1 = __importDefault(require("../lib/db"));
const error_1 = require("../utils/constant/error");
const bcrypt = __importStar(require("bcrypt"));
const authSchema_1 = __importDefault(require("../lib/validation/authSchema"));
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.findFirst({
        where: {
            id,
        },
    });
});
exports.getUser = getUser;
const insertUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = authSchema_1.default.registerSchema.validate(payload);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const isExist = yield db_1.default.user.findFirst({
        where: {
            OR: [
                {
                    username: value.username,
                },
                {
                    email: value.email,
                },
            ],
        },
    });
    if (isExist) {
        throw new Error("USER_IS_EXIST");
    }
    const hashedPassword = yield bcrypt.hash(value.password, 10);
    value.password = hashedPassword;
    const user = yield db_1.default.user.create({
        data: Object.assign({}, value),
    });
    const profile = yield db_1.default.profile.create({
        data: {
            userId: user.id,
        },
    });
    return { user, profile };
});
exports.insertUser = insertUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield db_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!existUser) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    yield db_1.default.user.delete({
        where: {
            id,
        },
    });
    return "Sukses delete user dengan id: " + id;
});
exports.deleteUser = deleteUser;
const updateUser = (id, body) => __awaiter(void 0, void 0, void 0, function* () {
    const existUser = yield db_1.default.user.findFirst({
        where: {
            id,
        },
    });
    if (!existUser) {
        throw new Error("User not found!!");
    }
    return db_1.default.user.update({
        where: {
            id,
        },
        data: body,
    });
});
exports.updateUser = updateUser;
function updateUserV2(id, body) {
    return db_1.default.user.update({
        where: {
            id,
        },
        data: body,
    });
}
exports.updateUserV2 = updateUserV2;
const getSingleUser = (condition) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.findFirst({
        where: condition,
    });
});
exports.getSingleUser = getSingleUser;
const getUsernameProfile = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const findUsername = yield db_1.default.user.findUnique({
        where: {
            username,
        },
        include: {
            profile: true,
            threads: true,
            following: true,
            followers: true,
        },
    });
    if (!findUsername) {
        throw new Error(error_1.ERROR_MESSAGE.DATA_NOT_FOUND);
    }
    return findUsername;
});
exports.getUsernameProfile = getUsernameProfile;
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.default.user.findMany({
        include: {
            following: true,
            followers: true,
        },
    });
});
exports.getAllUser = getAllUser;
