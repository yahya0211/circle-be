import { Router } from "express";
import * as authController from "../controller/authController";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/forgot-password", authController.forgotPaassword);
authRouter.patch("/reset-password/:resetToken", authController.resetPassword);
export default authRouter;
