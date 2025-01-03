import db from "../lib/db";
import { ERROR_MESSAGE } from "../utils/constant/error";

export const createLike = async (idThread: string, userId: string) => {
  const thisThread = await db.thread.findFirst({
    where: {
      id: idThread,
    },
  });
  if (!thisThread) {
    throw new Error(ERROR_MESSAGE.DATA_NOT_FOUND);
  }

  const existLike = await db.like.findFirst({
    where: {
      userId: userId,
      threadId: idThread,
    },
  });

  if (existLike) {
    await db.like.deleteMany({
      where: {
        userId: userId,
        threadId: idThread,
      },
    });
    return `Success unlike idThread with id ${idThread}`;
  } else {
    await db.like.create({
      data: {
        userId: userId,
        threadId: idThread,
      },
    });

    return `Success like idThread with id ${idThread}`;
  }
};
