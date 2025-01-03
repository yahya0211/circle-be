import { Request, Response } from "express";
import * as authService from "../services/2-authService";
import { errorHandler } from "../utils/errorHandler";
import { User } from "@prisma/client";
import sendEmail from "../middleware/email";

export const register = async (req: Request, res: Response) => {
  try {
    const dataRegister = await authService.register(req.body as User);
    res.status(200).json(dataRegister);
  } catch (error) {
    console.log(error);

    return errorHandler(error, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const dataLogin = await authService.login(req.body as User);
    res.status(200).json(dataLogin);
  } catch (error) {
    console.log(error);

    return errorHandler(error, res);
  }
};

export const forgotPaassword = async (req: Request, res: Response) => {
  try {
    const dataForgotPassword = await authService.forgotPaassword(req.body.email);
    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${dataForgotPassword.resetToken}`;
    const message = `We confirm that you have requested a password reset. Please click the following link: \n\n${resetUrl}\n\nIf you did not request a password reset, please ignore this email.`;
    await sendEmail({ email: req.body.email, subject: "Password Reset", message });
    res.status(200).json(dataForgotPassword);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const dataResetPassword = await authService.resetPassword(req.params.resetToken, req.body.newPassword);
    res.status(200).json(dataResetPassword);
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

