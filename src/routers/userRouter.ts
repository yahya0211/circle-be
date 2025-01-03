import { Router } from "express";
import * as userController from "../controller/userController";
import authentication from "../middleware/authentication";

const userRouter = Router();

userRouter.get("/getAllUser", userController.getAllUser);
userRouter.post("/", userController.createUser);
userRouter.delete("/:id", userController.deleteUser);
userRouter.get("/:userId", authentication, userController.getUser);
userRouter.get("/profile/:username", authentication, userController.getProfileUsername);
userRouter.put("/:userId", userController.updateUser);

export default userRouter;
