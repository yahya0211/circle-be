import { Router } from "express";
import * as likeController from "../controller/likeController";
import authentication from "../middleware/authentication";

const likeRouter = Router();

likeRouter.post("/:idThread", authentication, likeController.createLike);

export default likeRouter;
