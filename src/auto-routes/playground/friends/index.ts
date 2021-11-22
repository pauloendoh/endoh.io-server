import { plainToClass } from "class-transformer";
import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getRepository } from "typeorm";
import { Friend } from "../../../entities/playground/Friend";
import authMiddleware from "../../../middlewares/authMiddleware";
import { MyErrorsResponse } from "../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../utils/myConsoleError";

export default function friendsRoute(expressApp: Application) {
  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const sent = plainToClass(Friend, req.body);
          sent.userId = req.user.id;

          const saved = await getRepository(Friend).save(sent);

          return res.json(saved);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },

    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const friends = await getRepository(Friend).find({
            where: { userId: req.user.id },
          });

          return res.json(friends);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
