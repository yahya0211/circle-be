import { Profile } from "@prisma/client";
import db from "../lib/db";
import { IProfile } from "../type/app";

export const updateProfile = async (userId: string, body: Profile) => {
  const existedProfile = await db.profile.findFirst({
    where: {
      userId,
    },
  });

  if (!existedProfile) {
    throw new Error("User not found!");
  }

  return db.profile.update({
    where: {
      userId,
    },
    data: body,
  });
};

export const getProfile = async (userId: string) => {
  return await db.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      profile: true,
      like: true,
    },
  });
};
