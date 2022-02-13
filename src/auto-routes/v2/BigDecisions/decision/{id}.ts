import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getCustomRepository } from "typeorm";
import authMiddleware from "../../../../middlewares/authMiddleware";
import DecisionRepository from "../../../../repositories/BigDecisions/DecisionRepository";
import { MyErrorsResponse } from "../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../utils/myConsoleError";

export default function decisionRoute(expressApp: Application) {
  const decisionRepo = getCustomRepository(DecisionRepository);

  return <Resource>{
    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const decisionId = parseFloat(req.params.id);

        try {
          const decision = await decisionRepo.findOne({
            where: { id: decisionId, userId: req.user.id },
          });

          if (!decision) {
            return res
              .status(400)
              .json(
                new MyErrorsResponse(
                  `Doc doesn't exist or user doesn't own it.`
                )
              );
          }

          await decisionRepo.remove(decision);
          return res.status(200).json();
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
