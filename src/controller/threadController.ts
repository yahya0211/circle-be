import { Request, Response } from "express";
import * as threadService from "../services/3-threadServices";
import { errorHandler } from "../utils/errorHandler";

export const getThread = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    res.status(200).json(await threadService.getThread(id));
  } catch (error) {
    console.log(error);

    errorHandler(error, res);
  }
};

export const getThreads = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await threadService.getThreads());
  } catch (error) {
    console.log(error);

    errorHandler(error, res);
  }
};

export const createThreads = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    body.userId = res.locals.userId;

    console.log(body);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    res.status(200).json(await threadService.insertThread(body, files));
  } catch (error) {
    console.log(error);

    errorHandler(error, res);
  }
};

export const deleteThread = async (req: Request, res: Response) => {
  try {
    const { params } = req;
    const { threadId } = params;
    const userId = res.locals.userId;

    const messageDeleteThread = await threadService.deleteThread(threadId, userId);

    res.status(200).json({ message: messageDeleteThread });
  } catch (error) {
    console.log(error);
    return errorHandler(error, res);
  }
};

export const updateThread = async (req: Request, res: Response) => {
  try {

    const  body  = req.body.content;

    const params = req.params;
    const { threadId } = params;
    const userId = res.locals.userId;

    // Provide a fallback for files to ensure it is not undefined
    const files = (req.files as { [fieldname: string]: Express.Multer.File[] } | undefined) || {};

    const updatedThread = await threadService.updateThread(threadId, files, body, userId);

    res.status(200).json({ message: "Thread updated successfully", data: updatedThread });
  } catch (error) {
    console.error(error);
    return errorHandler(error, res);
  }
};
