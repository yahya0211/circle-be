import { Router } from "express";
import * as threadController from "../controller/threadController";
import uploadMiddleware from "../middleware/upload";
import authentication from "../middleware/authentication";

const threadRoute = Router();

threadRoute.get("/:id", threadController.getThread);
threadRoute.get("/", threadController.getThreads);
threadRoute.delete("/:userId", authentication, threadController.deleteThread);
threadRoute.post("/", authentication, uploadMiddleware(), threadController.createThreads);
threadRoute.patch("/:threadId", authentication, uploadMiddleware(), threadController.updateThread);

export default threadRoute;
