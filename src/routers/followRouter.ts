import { Router } from "express";
import * as followController from "../controller/followController";
import authentication from "../middleware/authentication";

const followRouter = Router();

followRouter.post("/:followingId", authentication, followController.follow);

export default followRouter;
