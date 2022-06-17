import { Request, Response } from "express";
import { User } from "../../entities/User";

export type MyContext = {
  req: Request & { user: User };
  res: Response;
};
