import { Application, Response } from "express";
import { Resource } from "express-automatic-routes";
import { IdsDto } from "../../../../../dtos/IdsDto";
import authMiddleware from "../../../../../middlewares/authMiddleware";
import { getResourceRepository } from "../../../../../repositories/relearn/ResourceRepository";
import { MyErrorsResponse } from "../../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../../utils/myConsoleError";

export default function deleteResourcesRoute(expressApp: Application) {
  return <Resource>{
    delete: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        const { ids } = req.body as IdsDto;
        const resourceRepo = getResourceRepository();

        try {
          await resourceRepo
            .createQueryBuilder()
            .delete()
            .where("userId = (:userId)", { userId: req.user.id })
            .andWhereInIds(ids)
            .execute();

          const allResources = await resourceRepo.findAllResourcesFromUser(
            req.user
          );
          return res.status(200).json(allResources);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}