import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { getCustomRepository } from "typeorm";
import { SearchResultsDto } from "../../dtos/utils/SearchResultsDto";
import authMiddleware from "../../middlewares/authMiddleware";
import ResourceRepository from "../../repositories/relearn/ResourceRepository";
import SkillRepository from "../../repositories/skillbase/SkillRepository";
import UserRepository from "../../repositories/UserRepository";
import { MyErrorsResponse } from "../../utils/ErrorMessage";
import { MyAuthRequest } from "../../utils/MyAuthRequest";
import { myConsoleError } from "../../utils/myConsoleError";

export default function searchRoute(expressApp: Application) {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const query = req.query.q as string;
        const resourcesRepo = getCustomRepository(ResourceRepository);
        const userRepo = getCustomRepository(UserRepository);
        const skillsRepo = getCustomRepository(SkillRepository);

        try {
          const results: SearchResultsDto = {
            resources: await resourcesRepo.getResourcesByText(req.user, query),
            users: await userRepo.getUsersByText(query),
            skills: await skillsRepo.getByText(req.user.id, query),
          };

          return res.status(200).json(results);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
