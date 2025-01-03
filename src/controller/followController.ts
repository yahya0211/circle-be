import { Request, Response } from "express";
import * as followService from "../services/4-followServices";

export const follow = async (req: Request, res: Response) => {
  try {
    const followingId = res.locals.userId;
    const followerId = req.params.followingId;

    const follow = await followService.follow(followerId, followingId);

    res.json({
      success: true,
      message: follow,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
