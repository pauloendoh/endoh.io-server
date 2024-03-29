import { Response } from "express";

export const getNotOwnerResponse = (res: Response) =>
  res
    .status(401)
    .json({
      message: "Resource doesn't exist or you don't have access to it.",
    });
