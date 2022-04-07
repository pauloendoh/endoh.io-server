import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getRepository } from "typeorm";
import { Label } from "../../../../entities/skillbase/Label";
import authMiddleware from "../../../../middlewares/authMiddleware";
import { MyErrorsResponse } from "../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../utils/myConsoleError";

export default function labelRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const labels = await getRepository(Label).find({
            where: { userId: req.user.id },
          });

          res.json(labels);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const body = req.body as Label;
        body.userId = req.user.id;
        try {
          const saved = await getRepository(Label).save(body);
          return res.json(saved);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
