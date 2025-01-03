import { Thread } from "@prisma/client";
import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";
import cloudinary from "../middleware/cloudinaryConfig";
import * as fs from "fs";

export const insertThread = async (body: Thread, files: { [fieldname: string]: Express.Multer.File[] }) => {
  const image_url: string[] = [];

  if (files && Array.isArray(files.image)) {
    for (const file of files.image) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Circle53",
      });
      image_url.push(result.secure_url);
      fs.unlinkSync(file.path);
    }
  }

  const thread = await db.thread.create({
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
};

export const getThread = async (id: string) => {
  const thread = await db.thread.findFirst({
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
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  return thread;
};

export const getThreads = async () => {
  return await db.thread.findMany({
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
};

export const deleteThread = async (idThread: string, userId: string) => {
  const existedThread = await db.thread.findFirst({
    where: {
      id: idThread,
    },
    include: {
      image: true,
    },
  });

  if (!existedThread) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  if (existedThread.userId !== userId) {
    throw new Error("You cannot allow to delete this thread");
  }

  await db.threadImage.deleteMany({
    where: {
      threadId: idThread,
    },
  });

  await db.thread.deleteMany({
    where: {
      id: idThread,
    },
  });

  return { existedThread };
};

export const updateThread = async (idThread: string, files: { [fieldname: string]: Express.Multer.File[] }, content: string, userId: string): Promise<any> => {
  // Check if the thread exists
  const existedThread = await db.thread.findFirst({
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

  const image_url: string[] = [];

  // Process new image uploads if provided
  if (files.image && Array.isArray(files.image)) {
    for (const file of files.image) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Circle53",
      });
      image_url.push(result.secure_url);
      fs.unlinkSync(file.path); // Remove local file after upload
    }
  }

  // Ensure content is defined or use fallback (existed content)
  const updatedContent = content || existedThread?.content;

  // Update the thread with optional new images
  const updatedThread = await db.thread.update({
    where: {
      id: idThread,
    },
    data: {
      content: updatedContent, // Use updated content or existing content
      image:
        image_url.length > 0
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
};
