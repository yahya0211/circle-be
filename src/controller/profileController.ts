import { Request, Response } from "express";
import * as profileServices from "../services/7-profileService";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const { body } = req;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    let cover: string | undefined = undefined;
    let avatar: string | undefined = undefined;

    if (files) {
      cover = files.cover?.[0]?.filename;
      avatar = files.avatar?.[0]?.filename;
    }

    if (cover) body.cover = cover;
    if (avatar) body.avatar = avatar;

    const dataUpdate = await profileServices.updateProfile(userId, body);

    res.json({
      status: true,
      message: "Success",
      data: dataUpdate,
    });
  } catch (error) {
    const err = error as Error;
    console.error("Error in updateProfile:", err.message);

    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;

    const profile = await profileServices.getProfile(userId);

    res.json({
      status: true,
      message: "success",
      data: profile,
    });
  } catch (error) {
    const err = error as unknown as Error;
    console.log(err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await profileServices.getProfile(id);


    res.json({
      status: true,
      message: "success",
      data: profile,
    });

    return;
  } catch (error) {
    const err = error as unknown as Error;
    console.log(err);

    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
