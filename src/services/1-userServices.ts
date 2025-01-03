import { User } from "@prisma/client";
import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";
import * as bcrypt from "bcrypt";
import { IRegister } from "../type/app";
import registerSchema from "../lib/validation/authSchema";
import { errorHandler } from "../utils/errorHandler";

export const getUser = async (id: string): Promise<User | null> => {
  return db.user.findFirst({
    where: {
      id,
    },
  });
};

export const insertUser = async (payload: IRegister) => {
  const { error, value } = registerSchema.registerSchema.validate(payload);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const isExist = await db.user.findFirst({
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

  const hashedPassword = await bcrypt.hash(value.password, 10);
  value.password = hashedPassword;

  const user = await db.user.create({
    data: {
      ...value,
    },
  });

  const profile = await db.profile.create({
    data: {
      userId: user.id,
    },
  });

  return { user, profile };
};

export const deleteUser = async (id: string): Promise<string> => {
  const existUser = await db.user.findFirst({
    where: {
      id,
    },
  });

  if (!existUser) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  await db.user.delete({
    where: {
      id,
    },
  });

  return "Sukses delete user dengan id: " + id;
};

export const updateUser = async (id: string, body: User): Promise<User | Error> => {
  const existUser = await db.user.findFirst({
    where: {
      id,
    },
  });

  if (!existUser) {
    throw new Error("User not found!!");
  }
  return db.user.update({
    where: {
      id,
    },
    data: body,
  });
};

export function updateUserV2(id: string, body: User): Promise<User> {
  return db.user.update({
    where: {
      id,
    },
    data: body,
  });
}

export const getSingleUser = async (condition: { [key: string]: string }): Promise<User | null> => {
  return db.user.findFirst({
    where: condition,
  });
};

export const getUsernameProfile = async (username: string) => {
  const findUsername = await db.user.findUnique({
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
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }
  return findUsername;
};

export const getAllUser = async () => {
  return db.user.findMany({
    include: {
      following: true,
      followers: true,
    },
  });
};
