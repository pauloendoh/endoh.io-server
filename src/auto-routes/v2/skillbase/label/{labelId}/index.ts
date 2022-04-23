import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getRepository } from "typeorm";
import { Label } from "../../../../../entities/skillbase/Label";
import authMiddleware from "../../../../../middlewares/authMiddleware";
import { MyErrorsResponse } from "../../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../../utils/myConsoleError";

export default function labelIdRoute(expressApp: Application) {
  return <Resource>{
    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const labelId = Number(req.params.labelId);
          const label = await getRepository(Label).findOne({
            where: {
              id: labelId,
              userId: req.user.id,
            },
          });

          if (!label)
            return res
              .status(404)
              .json(new MyErrorsResponse("Label not found"));

          // delete label and return skill
          await getRepository(Label).delete(label);
          return res.status(200).json(label);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
