import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getCustomRepository } from "typeorm";
import { Decision } from "../../../../entities/BigDecisions/Decision";
import authMiddleware from "../../../../middlewares/authMiddleware";
import DecisionRepository from "../../../../repositories/BigDecisions/DecisionRepository";
import { MyErrorsResponse } from "../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../utils/myConsoleError";

export default function decisionRoute(expressApp: Application) {
  const decisionRepo = getCustomRepository(DecisionRepository);

  return <Resource>{
    post: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const sentDecision = req.body as Decision;
        const { user } = req;

        try {
          if (sentDecision.id) {
            // TODO
            // check ownership
            const decision = await decisionRepo.findOne({
              where: { id: sentDecision.id, userId: user.id },
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
          }

          sentDecision.userId = req.user.id;
          const saved = await decisionRepo.save(sentDecision);
          const fullSaved = await decisionRepo.getFullDecision(saved.id);

          // const allDecisions = await decisionRepo.getAllFromUser(req.user.id)
          return res.status(200).json(fullSaved);
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
          const allDecisions = await decisionRepo.getAllFromUser(req.user.id);
          return res.status(200).json(allDecisions);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
