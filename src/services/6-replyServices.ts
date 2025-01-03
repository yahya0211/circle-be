import { Thread } from "@prisma/client";
import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";
import cloudinary from "../middleware/cloudinaryConfig";
import * as fs from "fs";

export const insertReply = async (threadId: string, body: Thread, files: { [fieldname: string]: Express.Multer.File[] }, userId: string) => {
  const thisThread = await db.thread.findUnique({
    where: {
      id: threadId,
    },
  });

  if (!thisThread) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  let image_url: string[] = [];

  if (Array.isArray(files.image)) {
    for (const file of files.image as Express.Multer.File[]) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Circle53",
      });
      image_url.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
  }

  const replies = await db.thread.create({
    data: {
      content: body.content,
      userId: userId,
      threadId: threadId,
    },
  });

  await db.threadImage.createMany({
    data: image_url.map((img) => ({
      url: img,
      threadId: replies.id,
    })),
  });

  return replies;
};

export const getAllReply = async () => {
  return await db.thread.findMany();
};

export const findReply = async (idThread: string) => {
  const replies = await db.thread.findFirst({
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
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  return replies;
};

export const deleteReply = async (threadId: string, idReply: string) => {
  const findThread = await db.thread.findFirst({
    where:{
      id:threadId
    }
  })
  

  if (!findThread) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

   await db.threadImage.deleteMany({
    where: {
      threadId: idReply,
    },
  });

  const deletedReply = await db.thread.delete({
    where: {
      id: idReply,
    },
  });

  return `success delete reply with id ${deletedReply.id}`;
};
