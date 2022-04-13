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
          const foundLabel = await getRepository(Label).findOne({
            where: { id: labelId, userId: req.user.id },
          });

          if (!foundLabel)
            return res
              .status(400)
              .json(new MyErrorsResponse("Label not found"));

          await getRepository(Label).remove(foundLabel);
          return res.status(200).json(foundLabel);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
