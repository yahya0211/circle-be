import * as userService from "./1-userServices";
import db from "../lib/db";
import { IRegister } from "../type/app";
import { User } from "@prisma/client";
import registerSchema from "../lib/validation/authSchema";
import { ERROR_MESSAGE } from "../utils/constant/error";
import bcrypt from "bcrypt";
import loginSchema from "../lib/validation/authSchema";
import jwt from "jsonwebtoken";
import * as crypto from "crypto";

const register = async (payload: IRegister) => {
  const { error, value } = registerSchema.registerSchema.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }

  if (!value.password || typeof value.password !== "string") {
    throw new Error("Password is required and must be a string.");
  }

  const isExist = await db.user.findFirst({
    where: {
      OR: [{ username: value.username }, { email: value.email }],
    },
  });

  if (isExist) {
    throw new Error("USER_IS_EXIST");
  }

  const hashedPassword = await bcrypt.hash(value.password, 10);
  value.password = hashedPassword;

  const user = await db.user.create({
    data: { ...value },
  });

  const profile = await db.profile.create({
    data: { userId: user.id },
  });

  return { user, profile };
};

const login = async (body: User): Promise<{ token: string }> => {
  // 1. validate input
  const { error, value } = loginSchema.loginSchema.validate(body);

  if (error?.details) {
    console.log(error);

    throw new Error(ERROR_MESSAGE.WRONG_INPUT);
  }

  // 2. check existing email
  const existEmail = await userService.getSingleUser({
    email: value.email,
  });

  if (!existEmail) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  // 3. check password
  const isMatch = await bcrypt.compare(value.password, existEmail.password);
  if (!isMatch) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  const token = jwt.sign(existEmail, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });

  return { token };
};

const forgotPaassword = async (email: string) => {
  const findEmail = await db.user.findFirst({
    where: {
      email,
    },
  });

  if (!findEmail) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expireToken = new Date(Date.now() + 60 * 60 * 1000);
  const passwordReset = await db.resetPassword.create({
    data: {
      tokenPassword: resetToken,
      passwordResetToken,
      userId: findEmail.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: expireToken,
    },
  });

  return { resetToken, passwordResetToken, passwordReset };
};

const resetPassword = async (token: string, newPassword: string) => {
  if (!newPassword || typeof newPassword !== "string") {
    throw new Error("New password is required and must be a string.");
  }

  const tokenReset = token;
  const resetRecord = await db.resetPassword.findFirst({
    where: {
      tokenPassword: tokenReset,
      expiresAt: { gt: new Date() },
    },
  });

  if (!resetRecord) {
    throw new Error("Invalid or expired reset token.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const passwordUpdate = await db.user.update({
    where: { id: resetRecord.userId },
    data: { password: hashedPassword },
    include: { resetPassword: true },
  });

  await db.resetPassword.delete({
    where: { id: resetRecord.id },
  });

  return { passwordUpdate };
};



export { register, login, forgotPaassword, resetPassword };
