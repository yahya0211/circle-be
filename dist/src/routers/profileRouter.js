"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = __importDefault(require("../middleware/authentication"));
const uploadV2_1 = __importDefault(require("../middleware/uploadV2"));
const profileController_1 = require("../controller/profileController");
const profileRouter = (0, express_1.Router)();
profileRouter.put("/", authentication_1.default, (0, uploadV2_1.default)("cover"), profileController_1.updateProfile);
profileRouter.get("/", authentication_1.default, profileController_1.getProfile);
profileRouter.get("/:id", authentication_1.default, profileController_1.getProfileById);
exports.default = profileRouter;
