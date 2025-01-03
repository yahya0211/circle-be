import { Router } from "express";
import authentication from "../middleware/authentication";
import uploadMiddleware from "../middleware/uploadV2";
import { updateProfile, getProfile, getProfileById } from "../controller/profileController";

const profileRouter = Router();

profileRouter.put("/", authentication, uploadMiddleware("cover"), updateProfile);

profileRouter.get("/", authentication, getProfile);
profileRouter.get("/:id", authentication, getProfileById);

export default profileRouter;
