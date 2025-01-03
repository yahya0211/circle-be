import { Request, Response } from "express";
import * as replyService from "../services/6-replyServices";
import { errorHandler } from "../utils/errorHandler";

export async function createReplies(req: Request, res: Response) {
  try {
    const { threadId } = req.params;
    const body = req.body;
    const userId = res.locals.userId;

    body.threadId = threadId;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    res.status(200).json(await replyService.insertReply(threadId, body, files, userId));
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
}

export async function getAllReply(req: Request, res: Response) {
  try {
    return res.status(200).json(await replyService.getAllReply());
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
}

export async function getReplies(req: Request, res: Response) {
  try {
    const { threadId } = req.params;
    res.status(200).json(await replyService.findReply(threadId));
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
}

export async function deleteReply(req: Request, res: Response) {
  try {
    const { threadId, replyId } = req.params;

    res.status(200).json(await replyService.deleteReply(threadId, replyId));
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
}
