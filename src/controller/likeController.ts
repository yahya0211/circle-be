import { Request, Response } from "express";
import * as likeService from "../services/5-likeService";

export const createLike = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const { idThread } = req.params;
    const dataLike = await likeService.createLike(idThread, userId);

    res.status(200).json({ message: dataLike });
  } catch (error) {
    const err = error as unknown as Error;
    console.log(err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
