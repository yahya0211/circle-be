import { Router } from "express";
import authRouter from "./authRouter";
import userRouter from "./userRouter";
import threadRoute from "./threadRouter";
import followRouter from "./followRouter";
import replyRouter from "./replyRouter";
import likeRouter from "./likeRouter";
import profileRouter from "./profileRouter";

const indexRouter = Router();

indexRouter.use("/api/user", userRouter);
indexRouter.use("/api/auth", authRouter);
indexRouter.use("/api/threads", threadRoute);
indexRouter.use("/api/follow", followRouter);
indexRouter.use("/api/reply", replyRouter);
indexRouter.use("/api/like", likeRouter);
indexRouter.use("/api/profile", profileRouter);

export default indexRouter;
