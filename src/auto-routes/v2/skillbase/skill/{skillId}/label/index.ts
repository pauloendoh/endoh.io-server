import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getRepository } from "typeorm";
import { Label } from "../../../../../../entities/skillbase/Label";
import { Skill } from "../../../../../../entities/skillbase/Skill";
import authMiddleware from "../../../../../../middlewares/authMiddleware";
import { MyErrorsResponse } from "../../../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../../../utils/myConsoleError";

export default function skillLabelRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const skillId = Number(req.params.skillId);

        try {
          const foundSkill = await getRepository(Skill).findOne({
            where: { userId: req.user.id, id: skillId },
            relations: ["labels"],
          });

          res.json(foundSkill);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const body = req.body as { labelId: number };
        const skillId = Number(req.params.skillId);

        try {
          const foundSkill = await getRepository(Skill).findOne({
            where: { userId: req.user.id, id: skillId },
            relations: ["labels"],
          });
          const foundLabel = await getRepository(Label).findOne({
            where: { id: body.labelId },
          });

          foundSkill.labels.push(foundLabel);
          const savedSkill = await getRepository(Skill).save(foundSkill);

          return res.json(savedSkill);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },

    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const body = req.body as { labelId: number };
        const skillId = Number(req.params.skillId);

        try {
          const foundSkill = await getRepository(Skill).findOne({
            where: { userId: req.user.id, id: skillId },
            relations: ["labels"],
          });
          const foundLabel = await getRepository(Label).findOne({
            where: { id: body.labelId },
          });

          // remove label from skill
          foundSkill.labels.splice(foundSkill.labels.indexOf(foundLabel), 1);
          const savedSkill = await getRepository(Skill).save(foundSkill);

          return res.json(savedSkill);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
