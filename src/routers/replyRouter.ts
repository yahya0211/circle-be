import { Router } from "express";
import * as replyController from "../controller/replyController";
import authentication from "../middleware/authentication";
import uploadMiddleware from "../middleware/upload";

const replyRouter = Router();

replyRouter.post("/:threadId", authentication, uploadMiddleware(), replyController.createReplies);
replyRouter.get("/", replyController.getAllReply);
replyRouter.get("/:threadId", replyController.getReplies);
replyRouter.delete("/:threadId/:replyId", authentication, replyController.deleteReply);

export default replyRouter;
